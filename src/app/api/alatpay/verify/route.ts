import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Official docket fee amounts enforced on the server
const DOCKET_FEES: Record<string, number> = {
  "Payment to Access the Forms Page": 100,
  "Payment for Tailoring Programme": 100000,
  "Payment for Fashion Training Programme": 100000,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionReference, feeType, amount, user } = body;

    // 1. Validate required fields
    if (!feeType || typeof feeType !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid fee docket type." },
        { status: 400 }
      );
    }

    if (!transactionReference) {
      return NextResponse.json(
        { success: false, error: "Missing ALATPay transaction reference." },
        { status: 400 }
      );
    }

    // 2. Server-side docket authorization & amount integrity check
    const expectedAmount = DOCKET_FEES[feeType];
    if (expectedAmount === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized docket item. Only official WMES fees are accepted.",
        },
        { status: 400 }
      );
    }

    // Normalise: ALATPay test mode sometimes returns amount in kobo (×100)
    const rawAmount = Number(amount);
    const normalisedAmount =
      rawAmount === expectedAmount
        ? rawAmount
        : rawAmount === expectedAmount * 100
        ? expectedAmount          // kobo → naira
        : rawAmount;

    console.log(`[Verify] feeType=${feeType} expected=₦${expectedAmount} received=₦${rawAmount} normalised=₦${normalisedAmount}`);

    if (normalisedAmount !== expectedAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Amount mismatch: Expected ₦${expectedAmount.toLocaleString()} but received ₦${rawAmount.toLocaleString()}.`,
        },
        { status: 400 }
      );
    }

    // 3. Server-side verification with ALATPay API (using Secret Key)
    const secretKey = process.env.ALATPAY_SECRET_KEY;
    let gatewayVerified = false;
    let gatewayErrorReason = "";

    if (secretKey && transactionReference) {
      // Query ALATPay Transaction API across Sandbox (apibox) and Production (api)
      const endpoints = [
        `https://apibox.alatpay.ng/alatpaytransaction/api/v1/transactions/${encodeURIComponent(transactionReference)}`,
        `https://api.alatpay.ng/alatpaytransaction/api/v1/transactions/${encodeURIComponent(transactionReference)}`,
      ];

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Ocp-Apim-Subscription-Key": secretKey,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const apiData = await response.json();
            const txData = apiData?.data;
            const status = (txData?.status || "").toString().toLowerCase();
            const isApiOk = apiData?.status === true;

            console.log(
              `[ALATPay Server Verification] endpoint=${endpoint} status=${status} apiOk=${isApiOk}`
            );

            // Only mark verified if gateway status is completed, successful, or success
            if (
              isApiOk &&
              (status === "completed" ||
                status === "successful" ||
                status === "success")
            ) {
              gatewayVerified = true;
              break;
            } else {
              // The gateway returned a definite non-successful status (e.g. "open", "failed", "declined", "pending")
              gatewayErrorReason =
                txData?.statusReason ||
                (status
                  ? `Transaction is not completed (current gateway status: '${status}'). Access cannot be granted.`
                  : "Transaction was not confirmed as successful by ALATPay.");
              break;
            }
          }
        } catch (err: any) {
          console.warn(`[ALATPay API query failed on ${endpoint}]:`, err?.message);
        }
      }
    }

    if (!gatewayVerified) {
      return NextResponse.json(
        {
          success: false,
          error:
            gatewayErrorReason ||
            "Transaction could not be confirmed as successful by ALATPay. Access has not been granted.",
        },
        { status: 402 }
      );
    }

    // 4. Generate official verified receipt and transaction object
    const isForms = feeType.includes("Forms");
    const receiptNo = `REC-2026-${isForms ? "010" : "100"}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const verifiedTxn = {
      id: transactionReference.startsWith("TXN-")
        ? transactionReference
        : `TXN-${transactionReference.slice(-8).toUpperCase()}`,
      date: "Today, Just Now",
      description: feeType,
      type: isForms ? "Forms Access Fee" : "Programme Tuition",
      amount: normalisedAmount,
      method: "ALATPay Checkout",
      status: "Paid" as const,
      receiptNo,
      reference: transactionReference,
      matricNo: user?.matricNo || "WMES/FTP/27A/0001",
      paidBy: user?.name || "Student",
      email: user?.email || "",
      verifiedAt: new Date().toISOString(),
    };

    // 5. Persist verified transaction to Supabase transactions table
    const { error: dbError } = await supabaseAdmin
      .from("transactions")
      .upsert(
        {
          id: verifiedTxn.id,
          matric_no: verifiedTxn.matricNo,
          description: verifiedTxn.description,
          type: verifiedTxn.type,
          amount: verifiedTxn.amount,
          method: verifiedTxn.method,
          status: verifiedTxn.status,
          receipt_no: verifiedTxn.receiptNo,
          reference: verifiedTxn.reference,
          paid_by: verifiedTxn.paidBy,
          email: verifiedTxn.email,
          verified_at: verifiedTxn.verifiedAt,
        },
        { onConflict: "id" }
      );

    if (dbError) {
      console.error("[Supabase Transaction Upsert Error]:", dbError);
    }

    return NextResponse.json({
      success: true,
      transaction: verifiedTxn,
      message: `Payment of ₦${expectedAmount.toLocaleString()} verified successfully via ALATPay.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server verification error.",
      },
      { status: 500 }
    );
  }
}
