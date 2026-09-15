import Image from "next/image";
import {
  AndroidLogo,
  AppleLogo,
  CalendarCheck,
  Camera,
  ChartLineUp,
  ChatsCircle,
  Heart,
  PenNib,
  FilmSlate,
  Hash,
} from "@phosphor-icons/react/dist/ssr";
import { projectBySlug } from "@/data/projects";
import { Sparkle } from "@/components/brand/logo";
import type { ServiceKey } from "@/data/services";

function Shot({ slug, className, sizes }: { slug: string; className?: string; sizes: string }) {
  const p = projectBySlug(slug)!;
  return (
    <div className={`overflow-hidden rounded-xl border border-line-strong bg-navy shadow-[0_30px_60px_-20px_rgb(4_6_20/0.8)] ${className ?? ""}`}>
      <div className="flex h-6 items-center gap-1.5 border-b border-line bg-navy-3 px-3" aria-hidden="true">
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
      </div>
      <Image src={p.image.src} alt={`${p.title} website`} width={p.image.width} height={p.image.height} sizes={sizes} className="h-auto w-full" />
    </div>
  );
}

function WebVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl" data-visual>
      <Shot slug="lemon-studio-dxb" sizes="(min-width: 768px) 30vw, 70vw" className="absolute left-0 top-[4%] w-[72%] -rotate-6" />
      <Shot slug="hayat-interiors" sizes="(min-width: 768px) 30vw, 70vw" className="absolute right-0 top-[20%] w-[72%] rotate-3" />
      <Shot slug="reveil-fragrance" sizes="(min-width: 768px) 32vw, 75vw" className="absolute bottom-0 left-[12%] w-[76%] -rotate-1" />
    </div>
  );
}

function AppsVisual() {
  const orbit = [
    { name: "Flutter", file: "flutter" },
    { name: "Dart", file: "dart" },
    { name: "React", file: "react" },
    { name: "Firebase", file: "firebase" },
    { name: "Android", file: "android" },
    { name: "Node.js", file: "nodedotjs" },
  ];
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center" data-visual>
      <div className="absolute inset-[6%] rounded-full border border-dashed border-paper/25" aria-hidden="true" />
      <div className="absolute inset-[6%] animate-[spin_40s_linear_infinite]" aria-hidden="true">
        {orbit.map((logo, i) => {
          const angle = (i / orbit.length) * Math.PI * 2;
          return (
            <span
              key={logo.file}
              className="absolute grid size-12 place-items-center rounded-full border border-paper/20 bg-indigo-deep md:size-14"
              // Rounded so server and client render identical style strings.
              style={{ left: `${(50 + Math.cos(angle) * 50).toFixed(3)}%`, top: `${(50 + Math.sin(angle) * 50).toFixed(3)}%`, translate: "-50% -50%" }}
            >
              <span
                className="logo-mask size-6 animate-[spin_40s_linear_infinite_reverse] text-paper"
                style={{ "--logo": `url(/stack/${logo.file}.svg)` } as React.CSSProperties}
                title={logo.name}
              />
            </span>
          );
        })}
      </div>
      <div className="relative flex gap-4">
        <div className="flex h-56 w-28 -rotate-6 flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-paper/80 bg-navy md:h-64 md:w-32">
          <AndroidLogo weight="fill" className="size-12 text-paper" />
          <span className="mono-label !text-paper">Android</span>
        </div>
        <div className="flex h-56 w-28 translate-y-6 rotate-6 flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-paper/80 bg-paper text-ink md:h-64 md:w-32">
          <AppleLogo weight="fill" className="size-12" />
          <span className="font-mono text-xs uppercase tracking-[0.08em]">iOS</span>
        </div>
      </div>
    </div>
  );
}

function SocialVisual() {
  const tiles = [
    { icon: Camera, label: "Shoot", tone: "bg-paper text-ink" },
    { icon: FilmSlate, label: "Reels", tone: "bg-navy text-paper" },
    { icon: PenNib, label: "Captions", tone: "bg-indigo text-white" },
    { icon: CalendarCheck, label: "Schedule", tone: "bg-navy text-paper" },
    { icon: null, label: "Crayora", tone: "bg-ink text-indigo" },
    { icon: Hash, label: "Reach", tone: "bg-paper text-ink" },
    { icon: ChatsCircle, label: "Replies", tone: "bg-indigo text-white" },
    { icon: Heart, label: "Community", tone: "bg-paper text-ink" },
    { icon: ChartLineUp, label: "Reports", tone: "bg-navy text-paper" },
  ];
  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-2 md:gap-3" data-visual>
      {tiles.map(({ icon: Icon, label, tone }) => (
        <div key={label} className={`flex aspect-square flex-col justify-between rounded-2xl p-3 md:p-4 ${tone}`}>
          {Icon ? <Icon weight="duotone" className="size-7 md:size-9" /> : <Sparkle className="size-10 md:size-12" />}
          <span className="text-xs font-semibold md:text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
}

function SoftwareVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl [perspective:1400px]" data-visual>
      <div className="absolute inset-0 [transform:rotateY(-14deg)_rotateX(8deg)] [transform-style:preserve-3d]">
        <Shot slug="coaching-shark" sizes="(min-width: 768px) 28vw, 65vw" className="absolute left-0 top-0 w-[68%] [transform:translateZ(-80px)]" />
        <Shot slug="clienter" sizes="(min-width: 768px) 28vw, 65vw" className="absolute right-0 top-[18%] w-[68%] [transform:translateZ(-40px)]" />
        <Shot slug="edusaarthi-india" sizes="(min-width: 768px) 32vw, 75vw" className="absolute bottom-0 left-[10%] w-[78%]" />
      </div>
    </div>
  );
}

export function ServiceVisual({ kind }: { kind: ServiceKey }) {
  switch (kind) {
    case "web":
      return <WebVisual />;
    case "apps":
      return <AppsVisual />;
    case "social":
      return <SocialVisual />;
    case "software":
      return <SoftwareVisual />;
  }
}
