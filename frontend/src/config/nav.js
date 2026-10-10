import { LayoutDashboard } from "lucide-react";

// Role-filtered navigation. Same shell, different entries per role.
// Rule: only routes that exist in App.jsx may appear here — no dead items.
// Feature entries (attendance, leave, directory, payroll, …) land with
// their pages and backend endpoints.
export const NAV_SECTIONS = Object.freeze([
  {
    label: "Workspace",
    items: Object.freeze([
      {
        to: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: Object.freeze(["admin", "manager", "employee", "hr", "recruiter"]),
      },
    ]),
  },
]);

export function navForRole(role) {
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !role || item.roles.includes(role)),
  })).filter((section) => section.items.length > 0);
}
