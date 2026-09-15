"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useRouteTransition } from "@/components/providers/route-transition";

type Props = ComponentProps<typeof Link> & { href: string };

/** next/link that plays the route loader before navigating. */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const { navigate } = useRouteTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external || target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };

  return <Link href={href} target={target} onClick={handleClick} {...rest} />;
}
