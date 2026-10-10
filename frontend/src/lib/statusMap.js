import {
  Archive,
  Check,
  Circle,
  CircleDot,
  Clock,
  FileText,
  Minus,
  Send,
  Star,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

// Single source of truth for every status shown in the app.
// Shape: Record<Domain, Record<Status, { label, tone, icon }>>.
// `tone` keys map to classes in StatusBadge — never color statuses inline.
export const STATUS_TONES = Object.freeze([
  "success",
  "warning",
  "danger",
  "info",
  "violet",
  "pink",
  "muted",
  "primary",
]);

export const statusMap = Object.freeze({
  attendance: Object.freeze({
    present: { label: "Present", tone: "success", icon: Check },
    late: { label: "Late", tone: "warning", icon: Clock },
    half_day: { label: "Half day", tone: "danger", icon: CircleDot },
    day_off: { label: "Day off", tone: "violet", icon: Minus },
    holiday: { label: "Holiday", tone: "pink", icon: Star },
    weekend: { label: "Weekend", tone: "muted", icon: Circle },
    future: { label: "Scheduled", tone: "success", icon: Circle },
    today: { label: "Today", tone: "danger", icon: CircleDot },
  }),
  leave: Object.freeze({
    pending: { label: "Pending", tone: "warning", icon: Clock },
    approved: { label: "Approved", tone: "success", icon: Check },
    rejected: { label: "Rejected", tone: "danger", icon: X },
    cancelled: { label: "Cancelled", tone: "muted", icon: Minus },
  }),
  candidate: Object.freeze({
    applied: { label: "Applied", tone: "info", icon: FileText },
    screening: { label: "Screening", tone: "warning", icon: Clock },
    interview_1: { label: "Interview 1", tone: "violet", icon: UserCheck },
    interview_2: { label: "Interview 2", tone: "violet", icon: UserCheck },
    offer: { label: "Offer", tone: "primary", icon: Send },
    accepted: { label: "Accepted", tone: "success", icon: Check },
    hired: { label: "Hired", tone: "success", icon: UserCheck },
    rejected: { label: "Rejected", tone: "danger", icon: UserX },
  }),
  review: Object.freeze({
    draft: { label: "Draft", tone: "muted", icon: FileText },
    submitted: { label: "Submitted", tone: "info", icon: Send },
    manager_review: { label: "Manager review", tone: "warning", icon: Clock },
    finalized: { label: "Finalized", tone: "success", icon: Check },
    archived: { label: "Archived", tone: "muted", icon: Archive },
    rejected: { label: "Rejected", tone: "danger", icon: X },
  }),
  payslip: Object.freeze({
    draft: { label: "Draft", tone: "muted", icon: FileText },
    generated: { label: "Generated", tone: "info", icon: FileText },
    locked: { label: "Locked", tone: "warning", icon: Clock },
    paid: { label: "Paid", tone: "success", icon: Check },
    amended: { label: "Amended", tone: "violet", icon: FileText },
  }),
});

export function getStatus(domain, status, fallback = { label: status, tone: "muted", icon: Circle }) {
  return statusMap[domain]?.[status] || fallback;
}
