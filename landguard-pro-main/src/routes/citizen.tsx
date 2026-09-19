import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  FileCheck2,
  FileText,
  History,
  Home,
  Layers,
  LayoutDashboard,
  Leaf,
  LogOut,
  Map,
  MapPin,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

import { DemoNotice } from "@/components/citizen/shell";
import { CitizenProvider, useCitizen } from "@/lib/citizen/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/citizen")({
  head: () => ({
    meta: [
      { title: "Citizen Portal | BHOOMIGUARD" },
      { name: "description", content: "Citizen portal for land record verification and status tracking." },
      { property: "og:title", content: "Citizen Portal | BHOOMIGUARD" },
      { property: "og:description", content: "View authorized land verification records." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CitizenLayout,
});

const CITIZEN_NAV = [
  { to: "/citizen", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/citizen/my-lands", label: "My Lands", icon: Home },
  { to: "/citizen/search-land", label: "Search Land", icon: Search },
  { to: "/citizen/map", label: "My Land Map", icon: Map },
  { to: "/citizen/survey-history", label: "Survey History", icon: History },
  { to: "/citizen/area-boundary", label: "Area & Boundary Status", icon: Layers },
  { to: "/citizen/land-health", label: "Land Health", icon: CheckCircle2 },
  { to: "/citizen/documents", label: "Documents", icon: FileText },
  { to: "/citizen/report-issue", label: "Report Issue", icon: AlertCircle },
  { to: "/citizen/re-verification", label: "Re-verification", icon: RotateCcw },
  { to: "/citizen/requests", label: "My Requests", icon: FileCheck2 },
  { to: "/citizen/reports", label: "Reports", icon: FileText },
  { to: "/citizen/notifications", label: "Notifications", icon: Bell },
  { to: "/citizen/profile", label: "Profile", icon: User },
] as const;

function CitizenLayout() {
  return (
    <CitizenProvider>
      <CitizenShell />
    </CitizenProvider>
  );
}

function CitizenShell() {
  const {
    isAuthenticated,
    hydrated,
    currentProfile,
    logout,
    selectedLand,
    lands,
    selectLand,
    unreadNotificationCount,
    switchDemoCitizen,
    citizenId,
  } = useCitizen();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        Loading Citizen Portal…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="max-w-sm rounded-lg border border-border bg-card p-6 text-center shadow-sm">
          <User className="mx-auto size-8 text-primary" />
          <h1 className="mt-3 text-lg font-bold text-brand-deep">Citizen sign-in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to view your authorized land records and verification status.
          </p>
          <Link
            to="/citizen-login"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Go to Citizen Login
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-brand-deep px-3 py-4 text-primary-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative grid size-9 place-items-center">
              <Leaf className="absolute bottom-0 left-0 size-6 rotate-[-28deg] text-brand-soft" />
              <MapPin className="absolute right-0 top-0 size-6 text-primary-foreground" />
            </span>
            <span className="text-base font-extrabold leading-none">
              BHOOMI<span className="text-brand-soft">GUARD</span>
              <span className="mt-0.5 block text-[0.6rem] font-medium text-primary-foreground/70">Citizen Portal</span>
            </span>
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        {/* Quick Demo Switcher in Sidebar */}
        <div className="mx-2 mt-4 rounded-md border border-primary-foreground/15 bg-primary-foreground/5 p-2.5">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-brand-soft">Demo Profile Switcher</p>
          <div className="mt-1.5 flex gap-1.5">
            <button
              type="button"
              onClick={() => switchDemoCitizen("citizen-01")}
              className={cn(
                "flex-1 rounded px-2 py-1 text-xs font-semibold transition-colors",
                citizenId === "citizen-01"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10",
              )}
            >
              Citizen 01
            </button>
            <button
              type="button"
              onClick={() => switchDemoCitizen("citizen-02")}
              className={cn(
                "flex-1 rounded px-2 py-1 text-xs font-semibold transition-colors",
                citizenId === "citizen-02"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10",
              )}
            >
              Citizen 02
            </button>
          </div>
        </div>

        <nav className="mt-4 space-y-1" aria-label="Citizen navigation">
          {CITIZEN_NAV.map(({ to, label, icon: Icon, ...rest }) => {
            const isNotif = to === "/citizen/notifications";
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  isActive(to, "exact" in rest ? rest.exact : false)
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0" />
                  {label}
                </span>
                {isNotif && unreadNotificationCount > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-destructive text-[0.65rem] font-bold text-destructive-foreground">
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate({ to: "/citizen-login" });
            }}
            className="mt-3 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground/80 hover:bg-destructive/25"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </nav>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-brand-deep/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="size-6 text-brand-deep" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-brand-deep">My Land Verification Center</p>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[0.65rem] font-bold text-brand-bright">
                CITIZEN ACCESS
              </span>
            </div>
            {selectedLand && (
              <p className="truncate text-xs text-muted-foreground">
                Active Land: Survey No. {selectedLand.survey_number} · {selectedLand.village}
              </p>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Quick land picker if citizen has multiple lands */}
            {lands.length > 1 && selectedLand && (
              <div className="hidden sm:flex items-center gap-2">
                <label htmlFor="top-land-select" className="text-xs font-semibold text-muted-foreground">
                  Land:
                </label>
                <select
                  id="top-land-select"
                  value={selectedLand.id}
                  onChange={(e) => selectLand(e.target.value)}
                  className="h-8 rounded-md border border-input bg-card px-2 text-xs font-bold text-brand-deep focus:border-primary outline-none"
                >
                  {lands.map((l) => (
                    <option key={l.id} value={l.id}>
                      Survey {l.survey_number} ({l.village})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <DemoNotice className="hidden xl:flex" />

            <Link
              to="/citizen/notifications"
              className="relative grid size-9 place-items-center rounded-full border border-border hover:bg-muted text-brand-deep"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-destructive text-[0.6rem] font-bold text-white">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>

            <div className="hidden text-right sm:block">
              <span className="block text-xs font-bold text-brand-deep">{currentProfile?.full_name}</span>
              <span className="block text-[0.65rem] text-muted-foreground">{currentProfile?.village}</span>
            </div>

            <div className="grid size-9 place-items-center rounded-full bg-secondary text-primary font-bold text-xs">
              {currentProfile?.full_name.charAt(0) ?? "C"}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="min-w-0 flex-1 space-y-5 p-4 sm:p-6">
          <DemoNotice className="xl:hidden" />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
