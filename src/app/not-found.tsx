import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Sparkle } from "@/components/brand/logo";
import { TransitionLink } from "@/components/ui/transition-link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="shell flex min-h-[100dvh] flex-col justify-center gap-10 py-32">
      <div className="flex items-center gap-4 font-display text-[clamp(6rem,24vw,20rem)] font-extrabold leading-none tracking-tighter">
        4
        <Sparkle className="size-[0.7em] animate-[spin_6s_linear_infinite] text-indigo" />
        4
      </div>
      <h1 className="display-md max-w-[18ch]">You dreamt this page. We haven&apos;t coded it yet.</h1>
      <p className="max-w-[46ch] text-lg text-mute">The link may be old or mistyped. The rest of the studio is still here.</p>
      <div className="flex flex-wrap gap-3">
        <TransitionLink href="/" className="btn btn-primary">
          Back home
          <ArrowUpRight weight="bold" className="size-4" />
        </TransitionLink>
        <TransitionLink href="/work" className="btn btn-ghost">
          See the work
        </TransitionLink>
      </div>
    </div>
  );
}
