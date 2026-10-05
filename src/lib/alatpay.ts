"use client";

export interface AlatpayUser {
  name: string;
  email: string;
  phone?: string;
  matricNo?: string;
}

export interface AlatpayPaymentOptions {
  feeType:
    | "Payment to Access the Forms Page"
    | "Payment for Tailoring Programme"
    | "Payment for Fashion Training Programme";
  amount: number;
  user: AlatpayUser;
  onSuccess: (transaction: any) => void;
  onClose?: () => void;
  onError?: (errorMessage: string) => void;
}

/**
 * Dynamically loads the official ALATPay Web SDK if not already loaded on the page
 */
export function loadAlatpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Alatpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://web.alatpay.ng/js/alatpay.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://web.alatpay.ng/js/alatpay.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load ALATPay script from https://web.alatpay.ng/js/alatpay.js");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Initiates the ALATPay popup and securely verifies the transaction on the backend
 */
export async function initiateAlatpayPayment({
  feeType,
  amount,
  user,
  onSuccess,
  onClose,
  onError,
}: AlatpayPaymentOptions) {
  const isLoaded = await loadAlatpayScript();

  if (!isLoaded || !(window as any).Alatpay) {
    onError?.("ALATPay payment gateway failed to load. Please check your internet connection.");
    return;
  }

  // Parse user full name into firstName and lastName
  const nameParts = (user.name || "WMES Trainee").trim().split(" ");
  const firstName = nameParts[0] || "Student";
  const lastName = nameParts.slice(1).join(" ") || "Trainee";

  const businessId =
    process.env.NEXT_PUBLIC_ALATPAY_BUSINESS_ID ||
    "77292ab3-0930-40bd-44af-08df140cec6d";

  const apiKey =
    process.env.NEXT_PUBLIC_ALATPAY_PUBLIC_KEY ||
    "415a2f7d680d4549ab8e97446cf965b4";

  try {
    const popup = (window as any).Alatpay.setup({
      apiKey,
      businessId,
      email: user.email || "student@worldedusystem.com",
      phone: user.phone || "+234 803 456 7890",
      firstName,
      lastName,
      currency: "NGN",
      amount,
      metaData: {
        feeType,
        matricNo: user.matricNo || "WMES-2026",
      },
      onTransaction: async function (response: any) {
        console.log("[ALATPay onTransaction Response]:", JSON.stringify(response, null, 2));

        // 1. Thoroughly validate gateway response status
        // ALATPay official specification: response.status === true indicates success
        const isTopLevelSuccess =
          response?.status === true ||
          response?.status === "success" ||
          response?.status === "successful";

        const innerStatus = (
          response?.data?.status ||
          response?.transactionStatus ||
          response?.statusDescription ||
          ""
        ).toString().toLowerCase();

        const responseCode = (response?.responseCode || response?.code || "").toString();

        const isExplicitFailure =
          response?.status === false ||
          response?.status === "failed" ||
          innerStatus.includes("fail") ||
          innerStatus.includes("declin") ||
          innerStatus.includes("cancel") ||
          innerStatus.includes("reject") ||
          innerStatus === "open" ||
          innerStatus === "pending" ||
          (responseCode !== "" && responseCode !== "00" && responseCode !== "0");

        if (!isTopLevelSuccess || isExplicitFailure) {
          console.warn("[ALATPay] Transaction not successful or was declined/open.", response);
          const failureReason =
            response?.data?.statusReason ||
            response?.message ||
            response?.responseDescription ||
            response?.error ||
            "Payment was not completed or was declined. Please try again.";
          onError?.(failureReason);
          return;
        }

        // 2. Extract REAL transaction reference
        const ref =
          response?.transactionReference ||
          response?.data?.id ||
          response?.data?.transactionId ||
          response?.transactionId ||
          response?.reference ||
          response?.id;

        if (!ref || typeof ref !== "string" || ref.trim().length === 0) {
          console.error("[ALATPay] Missing transaction reference in response:", response);
          onError?.("Unable to verify payment: transaction reference was not returned by gateway.");
          return;
        }

        try {
          // 🔒 Secure Server-Side Verification
          const verifyRes = await fetch("/api/alatpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transactionReference: ref.trim(),
              feeType,
              amount,
              user,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            onSuccess(verifyData.transaction);
          } else {
            const errorMsg =
              verifyData?.error || "Transaction could not be verified by server.";
            onError?.(errorMsg);
          }
        } catch (err: any) {
          console.error("Verification request error:", err);
          onError?.(err?.message || "Server verification connection failed.");
        }
      },
      onClose: function () {
        console.log("[ALATPay popup closed]");
        onClose?.();
      },
    });

    if (popup && typeof popup.show === "function") {
      popup.show();
    } else {
      onError?.("Unable to launch ALATPay checkout dialog.");
    }
  } catch (err: any) {
    console.error("ALATPay setup error:", err);
    onError?.(err?.message || "Failed to initialize ALATPay.");
  }
}
