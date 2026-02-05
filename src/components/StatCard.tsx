import type { ReactNode } from "react";

export default function StatCard({ label, value, helper }: { label: string; value: string; helper?: ReactNode }) {
  return (
    <div className="card flex flex-col gap-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
      {helper ? <div className="text-xs text-slate-400">{helper}</div> : null}
    </div>
  );
}
