"use client";

import type { ReactNode } from "react";

function Icon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-4 w-4"}
    >
      {children}
    </svg>
  );
}

function IconUser(props: { className?: string }) {
  return (
    <Icon className={props.className}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  );
}

function IconBadgeCheck(props: { className?: string }) {
  return (
    <Icon className={props.className}>
      <path d="M12 2l3 2 4 .5-.5 4L21 12l-2.5 3.5.5 4-4 .5-3 2-3-2-4-.5.5-4L3 12l2.5-3.5-.5-4 4-.5 3-2z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

const ABOUT = {
  name: "h4x0r",
  role: "ICT Trader",
  bio: "ICT концепцыг суурь болгон авч, хувь хүний туршлага, алдаа ба бодит кейсүүд дээр үндэслэн ойлгомжтой контент бүтээж бусдад мэдлэгээ хуваалцахаар бүтээв.",
} as const;

function HeroAboutCard() {
  return (
    <section className="w-full max-w-lg mx-auto">
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-2xl overflow-hidden animate-fade-in-up delay-200">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl border border-border/60 bg-background/40 flex items-center justify-center shadow-inner shrink-0">
            <IconUser className="h-[18px] w-[18px] text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-bold tracking-wider">
              Миний тухай
            </p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1 leading-tight truncate">
              {ABOUT.name}
            </h3>
            <div className="mt-1 inline-flex items-center gap-2 text-xs text-blue-500 font-bold">
              <IconBadgeCheck className="h-[14px] w-[14px]" />
              {ABOUT.role}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          {ABOUT.bio}
        </p>
      </div>
    </section>
  );
}

// Backwards-compatible name used by `app/page.tsx`
export function HeroChart() {
  return <HeroAboutCard />;
}


