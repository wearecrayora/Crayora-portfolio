import { GlobeHemisphereEast, Lightning, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { stats } from "@/data/projects";
import { cn } from "@/lib/cn";

const widgets = [
  {
    icon: SealCheck,
    value: `${stats[0].value}${stats[0].suffix}`,
    label: "Projects shipped",
    // Positioned around the 3D mark; the hero animates [data-widget] wrappers.
    place: "left-3 top-[5.5rem] lg:left-auto lg:right-[46%] lg:top-[20%]",
    float: "[animation-duration:6s]",
  },
  {
    icon: GlobeHemisphereEast,
    value: String(stats[1].value),
    label: "Countries served",
    place: "right-3 top-[20%] md:top-[36%] lg:right-[5%] lg:top-[24%]",
    float: "[animation-duration:7.5s] [animation-delay:-2s]",
  },
  {
    icon: Lightning,
    value: "1 day",
    label: "Reply time",
    place: "hidden lg:block lg:right-[30%] lg:bottom-[24%]",
    float: "[animation-duration:6.8s] [animation-delay:-4s]",
  },
];

/** Glass stat cards that float around the hero mark (motion is driven by the hero). */
export function HeroWidgets() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      {widgets.map(({ icon: Icon, value, label, place, float }) => (
        <div key={label} data-widget className={cn("absolute", place)}>
          <div className={cn("glass flex animate-[float_6s_ease-in-out_infinite] items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4", float)}>
            <span className="grid size-10 place-items-center rounded-xl bg-indigo text-white">
              <Icon weight="fill" className="size-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-extrabold tracking-tight text-ink">{value}</span>
              <span className="text-xs text-mute">{label}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
