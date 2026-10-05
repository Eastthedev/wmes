import { redirect } from "next/navigation";

export default function RedirectAdmissions() {
  redirect("/services#admissions");
}
