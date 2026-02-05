import { useEffect } from "react";

export default function Toast({ message, onClear }: { message: string; onClear: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClear, 3000);
    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="fixed right-4 top-4 z-50 rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-lg">
      {message}
    </div>
  );
}
