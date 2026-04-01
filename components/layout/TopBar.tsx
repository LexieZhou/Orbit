"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  PlusCircle, Menu, Heart, ArrowLeft,
  LayoutDashboard, Users, MapPin, Network, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { MOCK_USER } from "@/lib/mock-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",      label: "Dashboard",       icon: LayoutDashboard },
  { href: "/people",         label: "People",           icon: Users           },
  { href: "/map",            label: "Memory Map",       icon: MapPin          },
  { href: "/graph",          label: "Relationships",    icon: Network         },
  { href: "/insights",       label: "Insights",         icon: Lightbulb       },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":     "Dashboard",
  "/people":        "People",
  "/map":           "Memory Map",
  "/graph":         "Relationships",
  "/insights":      "Insights",
  "/activities/new":"Log Interaction",
};

// Sub-pages that have a meaningful "back" destination
const BACK_ROUTES: Record<string, string> = {
  "/activities/new": "/dashboard",
};

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine page title
  let title = PAGE_TITLES[pathname] ?? "Orbit";
  let backTo: string | null = BACK_ROUTES[pathname] ?? null;

  if (pathname.startsWith("/people/") && pathname !== "/people") {
    title = "Person Profile";
    backTo = "/people";
  }

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-card shrink-0 z-20">
      {/* Left: hamburger (mobile) + back button + title */}
      <div className="flex items-center gap-2 min-w-0">

        {/* Hamburger — mobile only */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-6 py-5 border-b">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-none">Orbit</p>
                <p className="text-xs text-muted-foreground mt-0.5">Relationship Memory</p>
              </div>
            </div>

            {/* Log Interaction CTA */}
            <div className="px-4 pt-4">
              <SheetClose asChild>
                <Link
                  href="/activities/new"
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  Log Interaction
                </Link>
              </SheetClose>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-4 pt-2 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (pathname.startsWith(href + "/") && href !== "/");
                return (
                  <SheetClose key={href} asChild>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>

            {/* User */}
            <div className="px-4 py-4 border-t">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
                  <AvatarFallback className="text-xs">{getInitials(MOCK_USER.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{MOCK_USER.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{MOCK_USER.email}</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Back button for sub-pages */}
        {backTo && (
          <button
            onClick={() => router.push(backTo!)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors shrink-0 mr-1"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        {/* Page title */}
        <h1 className="text-base font-semibold truncate">{title}</h1>
      </div>

      {/* Right: Log Interaction button */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/activities/new">
          <Button size="sm" className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Log Interaction</span>
            <span className="sm:hidden">Log</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
