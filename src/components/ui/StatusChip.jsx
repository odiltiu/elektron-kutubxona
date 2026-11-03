import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

const STYLES = {
  returned: { cls: "bg-emerald-50 text-emerald-800", Icon: CheckCircle2, label: "Qaytarilgan" },
  overdue: { cls: "bg-red-50 text-red-800", Icon: AlertCircle, label: "Muddati o'tgan" },
  active: { cls: "bg-gold-soft text-gold-text", Icon: Clock, label: "O'qilmoqda" },
};

export default function StatusChip({ status }) {
  const { cls, Icon, label } = STYLES[status] || STYLES.active;
  return (
    <span className={`chip ${cls}`}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}
