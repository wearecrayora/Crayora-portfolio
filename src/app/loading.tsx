import { Sparkle } from "@/components/brand/logo";

/** Shown if a route ever has to wait on the server. */
export default function Loading() {
  return (
    <div className="grid min-h-[100dvh] place-items-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-5">
        <Sparkle className="size-14 animate-[spin_1.6s_cubic-bezier(0.76,0,0.24,1)_infinite] text-indigo" />
        <span className="mono-label">Loading</span>
      </div>
    </div>
  );
}
