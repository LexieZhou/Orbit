"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, MapPin, Network,
  Lightbulb, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_USER } from "@/lib/mock-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
  { href: "/people",     label: "People",        icon: Users           },
  { href: "/map",        label: "Memory Map",    icon: MapPin          },
  { href: "/graph",      label: "Relationships", icon: Network         },
  { href: "/insights",   label: "Insights",      icon: Lightbulb       },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r bg-card shrink-0">
      {/* Logo → links to dashboard */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-4 border-b hover:bg-accent/30 transition-colors">
        {/* Four-pointed star logo */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)" }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2 C12 2 13.2 8.8 16 12 C13.2 15.2 12 22 12 22 C12 22 10.8 15.2 8 12 C10.8 8.8 12 2 12 2Z"
              fill="white"
            />
            <path
              d="M2 12 C2 12 8.8 13.2 12 16 C15.2 13.2 22 12 22 12 C22 12 15.2 10.8 12 8 C8.8 10.8 2 12 2 12Z"
              fill="white"
              fillOpacity="0.85"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-sm leading-none">Orbit</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Relationship Memory</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
          Navigation
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href + "/"));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )}
              />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tour link */}
      <div className="px-3 pb-1">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          Take a tour
        </Link>
      </div>

      {/* User profile */}
      <div className="px-3 py-3 border-t">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-default">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
            <AvatarFallback className="text-[10px]">{getInitials(MOCK_USER.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-medium leading-none truncate">{MOCK_USER.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{MOCK_USER.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
