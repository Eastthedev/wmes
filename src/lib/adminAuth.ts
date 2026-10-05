export interface AdminAuthorizedUser {
  email: string;
  role: "super_admin" | "secretary";
  title: string;
  displayName: string;
  portalPath: string;
}

export const ADMIN_AUTHORIZED_USERS: Record<string, AdminAuthorizedUser> = {
  "johnsunday0153@gmail.com": {
    email: "johnsunday0153@gmail.com",
    role: "secretary",
    title: "Secretary / Admissions Desk",
    displayName: "John Sunday (Admissions Secretary)",
    portalPath: "/desk",
  },
  "worldmobileedusystem@gmail.com": {
    email: "worldmobileedusystem@gmail.com",
    role: "super_admin",
    title: "Super Administrator",
    displayName: "WMES Super Admin",
    portalPath: "/admin",
  },
};

export function getAuthorizedAdmin(email: string): AdminAuthorizedUser | null {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return ADMIN_AUTHORIZED_USERS[clean] || null;
}
