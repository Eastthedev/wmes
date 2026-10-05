"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Send, User, Check, CheckCircle2, Lock } from "lucide-react";
import { compressImageFile } from "@/lib/imageCompression";

interface WMESApplicationFormProps {
  onToast: (msg: string) => void;
  portalId?: string;
  defaultFullName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  profilePhoto?: string | null;
  onSuccess?: () => void;
}

type CheckboxGroupProps = {
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
  single?: boolean;
};

function CheckboxGroup({ options, value, onChange, single }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (single) {
      onChange(value.includes(opt) ? [] : [opt]);
    } else {
      onChange(
        value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
      );
    }
  };
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <span
            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
              value.includes(opt)
                ? "border-red-600 bg-red-600 text-white"
                : "border-slate-400 bg-white"
            }`}
          >
            {value.includes(opt) && (
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                <path
                  d="M1.5 5l2.5 2.5 4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span>{opt}</span>
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#C0111F] text-white px-4 py-2 rounded-sm mt-6 mb-3 first:mt-0">
      <span className="font-bold text-xs sm:text-sm tracking-wide uppercase">
        {children}
      </span>
    </div>
  );
}

function FieldRow({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="border-b border-slate-200 pb-3 mb-3 last:border-0 last:mb-0">
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border-b border-slate-300 focus:border-red-600 outline-none text-xs sm:text-sm text-slate-900 bg-transparent py-1 transition-colors placeholder:text-slate-300";

const textareaCls =
  "w-full border border-slate-200 focus:border-red-600 rounded-md outline-none text-xs sm:text-sm text-slate-900 bg-transparent px-3 py-2 transition-colors placeholder:text-slate-300 resize-none";

export default function WMESApplicationForm({
  onToast,
  portalId,
  defaultFullName = "",
  defaultEmail = "",
  defaultPhone = "",
  profilePhoto,
  onSuccess,
}: WMESApplicationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passportPhoto, setPassportPhoto] = useState<string | null>(() => {
    if (profilePhoto) return profilePhoto;
    if (typeof window !== "undefined") {
      try {
        const sessionStr = localStorage.getItem("wmes_session");
        if (sessionStr) {
          const parsed = JSON.parse(sessionStr);
          const saved =
            parsed.avatarUrl ||
            parsed.avatar_url ||
            parsed.profilePhoto ||
            localStorage.getItem(`wmes_profile_photo_${parsed.matricNo || portalId}`) ||
            localStorage.getItem(`wmes_profile_photo_${parsed.email || defaultEmail}`);
          if (saved) return saved;
        }
      } catch (_e) {}
    }
    return null;
  });

  // Keep synchronized with profilePhoto prop whenever profile photo updates
  useEffect(() => {
    if (profilePhoto) {
      setPassportPhoto(profilePhoto);
    }
  }, [profilePhoto]);

  // Form Number is strictly the student's Portal ID (WMES/FTP/27A/xxxx)
  const [formNo, setFormNo] = useState<string>(() => {
    if (portalId) return portalId;
    if (typeof window !== "undefined") {
      try {
        const sessionStr = localStorage.getItem("wmes_session");
        if (sessionStr) {
          const parsed = JSON.parse(sessionStr);
          if (parsed.matricNo && parsed.matricNo.startsWith("WMES/FTP/27A/")) {
            return parsed.matricNo;
          }
        }
      } catch (_e) {}
    }
    return "";
  });

  const [formDate] = useState(new Date().toLocaleDateString("en-GB"));
  const [trainingCentre, setTrainingCentre] = useState("");

  // Section A
  const [fullName, setFullName] = useState(defaultFullName);
  const [gender, setGender] = useState<string[]>([]);
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState(""); // Always starts empty for client to manually enter
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState<string>(() => {
    if (defaultEmail) return defaultEmail;
    if (typeof window !== "undefined") {
      try {
        const sessionStr = localStorage.getItem("wmes_session");
        if (sessionStr) {
          const parsed = JSON.parse(sessionStr);
          if (parsed.email) return parsed.email;
        }
      } catch (_e) {}
    }
    return "";
  });
  const [education, setEducation] = useState("");
  const [currentStatus, setCurrentStatus] = useState<string[]>([]);
  const [currentStatusOther, setCurrentStatusOther] = useState("");
  const [motivation, setMotivation] = useState("");
  const [commitSixMonths, setCommitSixMonths] = useState<string[]>([]);
  const [decl1, setDecl1] = useState(false);
  const [decl2, setDecl2] = useState(false);
  const [decl3, setDecl3] = useState(false);
  const [applicantSig, setApplicantSig] = useState("");
  const [sigDate, setSigDate] = useState("");

  // Section B
  const [fashionTrack, setFashionTrack] = useState<string[]>([]);
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [lgaOfOrigin, setLgaOfOrigin] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<string[]>([]);
  const [hasFashionExp, setHasFashionExp] = useState<string[]>([]);
  const [fashionExpDetails, setFashionExpDetails] = useState("");
  const [hasSewingMachine, setHasSewingMachine] = useState<string[]>([]);
  const [afterTraining, setAfterTraining] = useState<string[]>([]);
  const [afterTrainingOther, setAfterTrainingOther] = useState("");
  const [heardThrough, setHeardThrough] = useState<string[]>([]);
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");
  const [guardianConsent, setGuardianConsent] = useState("");
  const [guardianSig, setGuardianSig] = useState("");
  const [guardianDate, setGuardianDate] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  // Section C
  const [ninNumber, setNinNumber] = useState("");
  const [ninType, setNinType] = useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = useState<string[]>([]);
  const [preferredLocationOther, setPreferredLocationOther] = useState("");
  const [docsAttached, setDocsAttached] = useState<string[]>([]);

  // Synchronize formNo with portalId
  React.useEffect(() => {
    if (portalId) {
      setFormNo(portalId);
    } else if (!formNo) {
      try {
        const sessionStr = localStorage.getItem("wmes_session");
        if (sessionStr) {
          const parsed = JSON.parse(sessionStr);
          if (parsed.matricNo && parsed.matricNo.startsWith("WMES/FTP/27A/")) {
            setFormNo(parsed.matricNo);
            return;
          }
        }
      } catch (_e) {}

      // Fetch next portal ID if not logged in
      fetch("/api/portal-id/next")
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.portalId) {
            setFormNo(d.portalId);
          }
        })
        .catch(() => {});
    }
  }, [portalId, formNo]);

  // Synchronize default user props
  React.useEffect(() => {
    if (defaultFullName && !fullName) setFullName(defaultFullName);
  }, [defaultFullName, fullName]);

  // Permanently sync registered account email
  React.useEffect(() => {
    if (defaultEmail) {
      setEmail(defaultEmail);
    } else {
      try {
        const sessionStr = localStorage.getItem("wmes_session");
        if (sessionStr) {
          const parsed = JSON.parse(sessionStr);
          if (parsed.email) setEmail(parsed.email);
        }
      } catch (_e) {}
    }
  }, [defaultEmail]);

  // Check if an existing application exists for this user and pre-fill non-phone/non-email fields
  React.useEffect(() => {
    const activeId = portalId || formNo;
    const activeEmail = email || defaultEmail;
    if (!activeId && !activeEmail) return;

    const params = new URLSearchParams();
    if (activeId) params.set("matricNo", activeId);
    if (activeEmail) params.set("email", activeEmail);

    fetch(`/api/applications?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.application) {
          const app = d.application;
          if (app.form_no) setFormNo(app.form_no);
          if (app.full_name) setFullName(app.full_name);
          if (app.gender) setGender(app.gender.split(", "));
          if (app.dob) setDob(app.dob);
          if (app.age) setAge(String(app.age));
          if (app.address) setAddress(app.address);
          if (app.education) setEducation(app.education);
          if (app.preferred_centre) setTrainingCentre(app.preferred_centre);
          if (app.nin_number) setNinNumber(app.nin_number);
          if (app.passport_photo_url) setPassportPhoto(app.passport_photo_url);
          if (Array.isArray(app.current_status)) setCurrentStatus(app.current_status);
          if (app.raw_data) {
            const raw = app.raw_data;
            if (raw.fashionTrack) {
              setFashionTrack(
                Array.isArray(raw.fashionTrack)
                  ? raw.fashionTrack
                  : [raw.fashionTrack]
              );
            }
            if (raw.stateOfOrigin) setStateOfOrigin(raw.stateOfOrigin);
            if (raw.lgaOfOrigin) setLgaOfOrigin(raw.lgaOfOrigin);
            if (raw.maritalStatus) setMaritalStatus(Array.isArray(raw.maritalStatus) ? raw.maritalStatus : [raw.maritalStatus]);
            if (raw.hasFashionExp) setHasFashionExp(Array.isArray(raw.hasFashionExp) ? raw.hasFashionExp : [raw.hasFashionExp]);
            if (raw.fashionExpDetails) setFashionExpDetails(raw.fashionExpDetails);
            if (raw.hasSewingMachine) setHasSewingMachine(Array.isArray(raw.hasSewingMachine) ? raw.hasSewingMachine : [raw.hasSewingMachine]);
            if (raw.afterTraining) setAfterTraining(Array.isArray(raw.afterTraining) ? raw.afterTraining : [raw.afterTraining]);
            if (raw.afterTrainingOther) setAfterTrainingOther(raw.afterTrainingOther);
            if (raw.heardThrough) setHeardThrough(Array.isArray(raw.heardThrough) ? raw.heardThrough : [raw.heardThrough]);
            if (raw.emergencyName) setEmergencyName(raw.emergencyName);
            if (raw.emergencyPhone) setEmergencyPhone(raw.emergencyPhone);
            if (raw.specialNeeds) setSpecialNeeds(raw.specialNeeds);
            if (raw.guardianConsent) setGuardianConsent(raw.guardianConsent);
            if (raw.guardianDate) setGuardianDate(raw.guardianDate);
            if (raw.guardianPhone) setGuardianPhone(raw.guardianPhone);
            if (raw.ninType) setNinType(Array.isArray(raw.ninType) ? raw.ninType : [raw.ninType]);
            if (raw.preferredLocation) setPreferredLocation(Array.isArray(raw.preferredLocation) ? raw.preferredLocation : [raw.preferredLocation]);
            if (raw.preferredLocationOther) setPreferredLocationOther(raw.preferredLocationOther);
            if (raw.docsAttached) setDocsAttached(Array.isArray(raw.docsAttached) ? raw.docsAttached : [raw.docsAttached]);
          }
        }
      })
      .catch(() => {});
  }, [portalId, defaultEmail, defaultFullName]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 360, 360, 0.82);
        setPassportPhoto(compressed);
      } catch (_err) {
        const reader = new FileReader();
        reader.onload = (ev) => setPassportPhoto(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      onToast("Please enter your full name before submitting.");
      return;
    }
    if (!phone.trim()) {
      onToast("Please enter your phone number.");
      return;
    }
    const activeFormEmail = (email || defaultEmail).trim();
    if (!activeFormEmail) {
      onToast("Account email is required.");
      return;
    }
    if (fashionTrack.length === 0) {
      onToast("Please select your fashion training track (Male Fashion Making, Female Fashion Making, or Both).");
      return;
    }

    setSubmitting(true);

    try {
      const activeFormNo = formNo || portalId;
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formNo: activeFormNo,
          matricNo: activeFormNo,
          fullName,
          gender,
          dob,
          age,
          phone: phone.trim(),
          email: activeFormEmail,
          address,
          education,
          currentStatus,
          ninNumber,
          preferredCentre: trainingCentre,
          passportPhoto,
          fashionTrack: fashionTrack.join(", "),
          rawData: {
            fashionTrack,
            currentStatusOther,
            motivation,
            commitSixMonths,
            decl1,
            decl2,
            decl3,
            applicantSig,
            sigDate,
            stateOfOrigin,
            lgaOfOrigin,
            maritalStatus,
            hasFashionExp,
            fashionExpDetails,
            hasSewingMachine,
            afterTraining,
            afterTrainingOther,
            heardThrough,
            emergencyName,
            emergencyPhone,
            specialNeeds,
            guardianConsent,
            guardianSig,
            guardianDate,
            guardianPhone,
            ninType,
            preferredLocation,
            preferredLocationOther,
            docsAttached,
          },
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (res.ok && data.success) {
        setSubmitted(true);
        if (data.formNo) setFormNo(data.formNo);
        onToast(`Application submitted! Form No: ${data.formNo}. Saved to Registry.`);
        onSuccess?.();
      } else {
        onToast(data.error || "Failed to submit application. Please check fields and try again.");
      }
    } catch (_e) {
      setSubmitting(false);
      onToast("Network error submitting application. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="p-10 sm:p-16 rounded-2xl bg-white border border-amber-200 shadow-sm text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-5">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 mb-3 font-mono uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Status: Pending Secretary Review
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Application Successfully Submitted</h3>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-4">
          Your application for the <strong>6-Month Professional Fashion Training Programme 2026/2027</strong> has been submitted to the Registry. It is currently <strong>Pending Review</strong> by the Secretary Desk.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-mono font-bold text-slate-700 border border-slate-200">
          Form No / Portal ID: <span className="text-[#C0111F]">{formNo}</span>
        </div>
        <button onClick={() => setSubmitted(false)} className="mt-6 text-xs text-blue-600 hover:underline font-semibold cursor-pointer">
          Review / update application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* MASTHEAD */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-10 pt-8 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-black tracking-widest text-[#C0111F] uppercase mb-0.5">
            World Mobile Educational System (WMES)
          </h2>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Global Management Hub &nbsp;|&nbsp; 6-Month Professional Fashion Training Programme 2026/2027
          </p>
          <div className="inline-block border-t-2 border-b-2 border-[#C0111F] py-1 px-8 mt-1">
            <h3 className="text-sm sm:text-base font-extrabold text-[#C0111F] uppercase tracking-widest">Application Form</h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold w-36 shrink-0">Form No:</span>
              <span className="font-mono font-bold text-[#C0111F] bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs sm:text-sm">
                {formNo || "Generating..."}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                (Portal ID)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold w-36 shrink-0">Date:</span>
              <span className="font-mono text-slate-900">{formDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Preferred Training Centre:</span>
              <input type="text" value={trainingCentre} onChange={(e) => setTrainingCentre(e.target.value)} placeholder="e.g. Enugu Head Centre" className={inputCls} />
            </div>
          </div>

          <div className="shrink-0 self-start">
            <div className="w-32 h-36 border-2 border-slate-300 rounded-sm flex flex-col items-center justify-center text-slate-400 overflow-hidden relative bg-slate-50 shadow-xs">
              {passportPhoto ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={passportPhoto}
                    alt="Passport Photograph"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-950/85 backdrop-blur-xs py-1 px-1 flex items-center justify-center gap-1 text-[9px] font-bold text-emerald-300">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Profile Synced</span>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:text-red-500 transition-colors p-2 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <User className="w-8 h-8 mb-1.5 stroke-[1.5]" />
                  <span className="text-[10px] font-semibold leading-tight">
                    PASSPORT PHOTO
                  </span>
                  <span className="text-[8px] text-slate-400 mt-0.5">
                    (Syncs from Profile or attach here)
                  </span>
                  <Upload className="w-3.5 h-3.5 mt-1.5 text-slate-400" />
                </label>
              )}
            </div>
            {passportPhoto && (
              <label className="block text-center mt-1 text-[9px] font-mono text-slate-500 hover:text-red-600 cursor-pointer underline">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                Change photo
              </label>
            )}
          </div>
        </div>
      </div>

      {/* FORM BODY */}
      <div className="px-6 sm:px-10 pb-10">

        {/* SECTION A */}
        <SectionHeader>Section A — Personal Information</SectionHeader>

        <FieldRow label="1. Full Name (Surname first, then other names)" required>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Okonkwo Chidi Emmanuel" className={inputCls} required />
        </FieldRow>

        <FieldRow label="2. Gender">
          <CheckboxGroup options={["Male", "Female", "Prefer not to say"]} value={gender} onChange={setGender} single />
        </FieldRow>

        <FieldRow label="3. Date of Birth (DD/MM/YYYY) & Age">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Date of Birth</span>
              <input type="text" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="DD/MM/YYYY" className={inputCls} />
            </div>
            <div className="w-full sm:w-28">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Age</span>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 24" min={0} max={99} className={inputCls} />
            </div>
          </div>
        </FieldRow>

        <FieldRow label="4. Phone Number (WhatsApp preferred)">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number (e.g. 08012345678)"
            className={inputCls}
          />
        </FieldRow>

        <FieldRow label="5. Residential Address (including LGA and State)">
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, LGA, State" className={inputCls} />
        </FieldRow>

        <FieldRow label="6. Email Address (Account Email)">
          <div className="relative">
            <input
              type="email"
              value={email || defaultEmail}
              readOnly
              placeholder="Registered account email"
              className={`${inputCls} bg-slate-100/90 border-slate-200 text-slate-700 font-medium cursor-not-allowed select-none pr-28`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold pointer-events-none">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Account Email</span>
            </div>
          </div>
        </FieldRow>

        <FieldRow label="7. Highest Educational Qualification">
          <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. B.Sc. Business Administration, WAEC/NECO" className={inputCls} />
        </FieldRow>

        <FieldRow label="8. Current Status">
          <CheckboxGroup
            options={["Unemployed", "Student", "Self-employed", "Employed", "NYSC"]}
            value={currentStatus}
            onChange={(v) => { setCurrentStatus(v); if (!v.includes("Other")) setCurrentStatusOther(""); }}
            single
          />
          <div className="flex items-center gap-2 mt-2">
            <button type="button" onClick={() => { if (currentStatus.includes("Other")) { setCurrentStatus(currentStatus.filter((v) => v !== "Other")); setCurrentStatusOther(""); } else { setCurrentStatus(["Other"]); } }} className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${currentStatus.includes("Other") ? "border-red-600 bg-red-600 text-white" : "border-slate-400 bg-white"}`}>
                {currentStatus.includes("Other") && (<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
              </span>
              Other:
            </button>
            <input type="text" value={currentStatusOther} onChange={(e) => { setCurrentStatusOther(e.target.value); if (!currentStatus.includes("Other")) setCurrentStatus(["Other"]); }} placeholder="Specify..." className="flex-1 border-b border-slate-300 focus:border-red-600 outline-none text-xs text-slate-900 bg-transparent py-0.5 placeholder:text-slate-300" />
          </div>
        </FieldRow>

        <FieldRow label="9. Why do you want to join this programme? (short motivation)">
          <textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="Write your short motivation here..." rows={3} className={textareaCls} />
        </FieldRow>

        <FieldRow label="10. Can you commit to the full 6 months of training?">
          <CheckboxGroup options={["Yes", "No"]} value={commitSixMonths} onChange={setCommitSixMonths} single />
        </FieldRow>

        {/* Declaration / Consent */}
        <div className="border-b border-slate-200 pb-4 mb-3">
          <p className="text-xs font-semibold text-slate-700 mb-2">11. Declaration / Consent</p>
          <div className="space-y-2">
            {[
              { val: decl1, set: setDecl1, label: "I declare that the information provided is true and correct." },
              { val: decl2, set: setDecl2, label: "I agree to abide by the rules of the WMES Fashion Training Programme." },
              { val: decl3, set: setDecl3, label: "I consent to the use of my data and photographs for programme administration and approved publicity." },
            ].map(({ val, set, label }, i) => (
              <button key={i} type="button" onClick={() => set(!val)} className="flex items-start gap-2 text-left w-full group">
                <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${val ? "border-red-600 bg-red-600 text-white" : "border-slate-400 bg-white"}`}>
                  {val && (<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                </span>
                <span className="text-xs text-slate-700 group-hover:text-slate-900">{label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-40">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Date</span>
              <input type="text" value={sigDate} onChange={(e) => setSigDate(e.target.value)} placeholder="DD/MM/YYYY" className={inputCls} />
            </div>
          </div>
        </div>

        {/* SECTION B */}
        <SectionHeader>Section B — Additional Information</SectionHeader>

        <FieldRow label="12. State & LGA of Origin">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">State of Origin</span>
              <input type="text" value={stateOfOrigin} onChange={(e) => setStateOfOrigin(e.target.value)} placeholder="e.g. Enugu State" className={inputCls} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">LGA of Origin</span>
              <input type="text" value={lgaOfOrigin} onChange={(e) => setLgaOfOrigin(e.target.value)} placeholder="e.g. Enugu East" className={inputCls} />
            </div>
          </div>
        </FieldRow>

        <FieldRow label="13. Marital Status">
          <CheckboxGroup options={["Single", "Married", "Divorced", "Widowed", "Other"]} value={maritalStatus} onChange={setMaritalStatus} single />
        </FieldRow>

        <FieldRow label="14. Fashion Training Focus (What do you want to learn?)" required>
          <p className="text-[11px] text-slate-500 mb-1.5">
            Please indicate whether you want to learn male fashion making, female fashion making, or both:
          </p>
          <CheckboxGroup
            options={["Male Fashion Making", "Female Fashion Making", "Both"]}
            value={fashionTrack}
            onChange={setFashionTrack}
            single
          />
        </FieldRow>

        <FieldRow label="15. Previous experience in fashion/tailoring/related skills?">
          <CheckboxGroup options={["Yes", "No"]} value={hasFashionExp} onChange={setHasFashionExp} single />
          {hasFashionExp.includes("Yes") && (
            <div className="mt-2">
              <span className="text-[10px] text-slate-500 font-semibold">If Yes, brief details:</span>
              <input type="text" value={fashionExpDetails} onChange={(e) => setFashionExpDetails(e.target.value)} placeholder="Describe your experience..." className={inputCls} />
            </div>
          )}
        </FieldRow>

        <FieldRow label="16. Do you own or have access to a sewing machine?">
          <CheckboxGroup options={["Yes", "No"]} value={hasSewingMachine} onChange={setHasSewingMachine} single />
        </FieldRow>

        <FieldRow label="17. What do you hope to do after the training?">
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-1">
            {["Start a business", "Get employed", "Improve existing business"].map((opt) => (
              <button key={opt} type="button" onClick={() => setAfterTraining(afterTraining.includes(opt) ? afterTraining.filter((v) => v !== opt) : [...afterTraining.filter((v) => v !== "Other"), opt])} className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer">
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${afterTraining.includes(opt) ? "border-red-600 bg-red-600 text-white" : "border-slate-400 bg-white"}`}>
                  {afterTraining.includes(opt) && (<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                </span>
                {opt}
              </button>
            ))}
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { if (afterTraining.includes("Other")) { setAfterTraining(afterTraining.filter((v) => v !== "Other")); setAfterTrainingOther(""); } else { setAfterTraining(["Other"]); } }} className="flex items-center gap-1.5 text-xs text-slate-700">
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${afterTraining.includes("Other") ? "border-red-600 bg-red-600 text-white" : "border-slate-400 bg-white"}`}>
                  {afterTraining.includes("Other") && (<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                </span>
                Other:
              </button>
              <input type="text" value={afterTrainingOther} onChange={(e) => { setAfterTrainingOther(e.target.value); if (!afterTraining.includes("Other")) setAfterTraining(["Other"]); }} placeholder="Specify..." className="border-b border-slate-300 focus:border-red-600 outline-none text-xs text-slate-900 bg-transparent py-0.5 w-32 placeholder:text-slate-300" />
            </div>
          </div>
        </FieldRow>

        <FieldRow label="18. How did you hear about this programme?">
          <CheckboxGroup options={["TikTok", "Facebook", "Instagram", "X", "Radio", "Friend", "Other"]} value={heardThrough} onChange={setHeardThrough} />
        </FieldRow>

        <FieldRow label="19. Emergency Contact Name & Phone">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Name</span>
              <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Full name" className={inputCls} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Phone</span>
              <input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="+234 800 000 0000" className={inputCls} />
            </div>
          </div>
        </FieldRow>

        <FieldRow label="20. Any physical condition or special need we should know about?">
          <textarea value={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.value)} placeholder="Leave blank if none..." rows={2} className={textareaCls} />
        </FieldRow>

        <FieldRow label="21. Parent/Guardian Consent (if under 18)">
          <p className="text-xs text-slate-500 mb-2">I, <span className="font-semibold text-slate-700">(Parent/Guardian)</span>, consent to my ward&apos;s participation.</p>
          <input type="text" value={guardianConsent} onChange={(e) => setGuardianConsent(e.target.value)} placeholder="Parent / Guardian full name" className={`${inputCls} mb-3`} />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-36">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Date</span>
              <input type="text" value={guardianDate} onChange={(e) => setGuardianDate(e.target.value)} placeholder="DD/MM/YYYY" className={inputCls} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Phone</span>
              <input type="tel" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} placeholder="+234 800 000 0000" className={inputCls} />
            </div>
          </div>
        </FieldRow>

        {/* SECTION C */}
        <SectionHeader>Section C — Documents &amp; Preferred Location</SectionHeader>

        <FieldRow label="22. NIN / ID Number & Type">
          <input type="text" value={ninNumber} onChange={(e) => setNinNumber(e.target.value)} placeholder="Enter your ID number" className={`${inputCls} mb-2`} />
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold block mb-1">ID Type:</span>
            <CheckboxGroup options={["NIN", "Voter's Card", "Driver's Licence", "Passport"]} value={ninType} onChange={setNinType} single />
          </div>
        </FieldRow>

        <FieldRow label="23. Preferred Training Location">
          <CheckboxGroup options={["Enugu (Head Centre)", "Nsukka", "Oji-River", "Awgu", "Ezeagu", "Udi", "Igbo-Etiti", "Nkanu East", "Isi-Uzo", "Enugu South"]} value={preferredLocation} onChange={setPreferredLocation} single />
          <div className="flex items-center gap-2 mt-2">
            <button type="button" onClick={() => { if (preferredLocation.includes("Other")) { setPreferredLocation(preferredLocation.filter((v) => v !== "Other")); setPreferredLocationOther(""); } else { setPreferredLocation(["Other"]); } }} className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${preferredLocation.includes("Other") ? "border-red-600 bg-red-600 text-white" : "border-slate-400 bg-white"}`}>
                {preferredLocation.includes("Other") && (<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
              </span>
              Other:
            </button>
            <input type="text" value={preferredLocationOther} onChange={(e) => { setPreferredLocationOther(e.target.value); if (!preferredLocation.includes("Other")) setPreferredLocation(["Other"]); }} placeholder="Specify..." className="border-b border-slate-300 focus:border-red-600 outline-none text-xs text-slate-900 bg-transparent py-0.5 flex-1 placeholder:text-slate-300" />
          </div>
        </FieldRow>

        <FieldRow label="24. Documents Attached">
          <CheckboxGroup options={["Passport Photograph", "Photocopy of NIN/ID", "Other (optional)"]} value={docsAttached} onChange={setDocsAttached} />
        </FieldRow>

        {/* SUBMIT */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 text-center sm:text-left leading-snug">
            WMES Eastern Regional HQ: Chika&apos;s Plaza, Centenary Estate, Enugu &nbsp;|&nbsp; Tel: 0803 089 6650 &nbsp;|&nbsp; www.worldedusystem.com
          </p>
          <button type="submit" disabled={submitting} className="px-7 py-3 rounded-xl bg-[#C0111F] hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-red-700/20 cursor-pointer transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed shrink-0">
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
