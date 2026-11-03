// muhaddis.uz uslubidagi bo'lim sarlavhasi: oldida oltin halqa belgisi
export default function SectionTitle({ as: Tag = "h2", children, action, className = "" }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <Tag className="flex items-center gap-2.5 text-base font-semibold text-ink sm:text-lg">
        <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        {children}
      </Tag>
      {action}
    </div>
  );
}
