import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Compass,
  FileText,
  Gauge,
  History,
  LayoutDashboard,
  Leaf,
  ListOrdered,
  LogOut,
  Map,
  MapPin,
  Menu,
  Plane,
  Satellite,
  Scale,
  ScanSearch,
  Search,
  ShieldCheck,
  Table2,
  X,
} from "lucide-react";
import { useState } from "react";

import { DemoBanner } from "@/components/officer/shell";
import { OfficerProvider, useOfficer } from "@/lib/officer/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/officer")({
  head: () => ({
    meta: [
      { title: "Officer Portal | BHOOMIGUARD" },
      { name: "description", content: "BHOOMIGUARD Officer Portal for land record verification, GIS mapping and discrepancy analysis." },
      { property: "og:title", content: "Officer Portal | BHOOMIGUARD" },
      { property: "og:description", content: "Land record verification workspace for revenue officers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OfficerLayout,
});

const NAV = [
  { to: "/officer", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/officer/land-search", label: "Land Search", icon: Search },
  { to: "/officer/land-records", label: "Land Records", icon: Table2 },
  { to: "/officer/map", label: "GIS / Land Map", icon: Map },
  { to: "/officer/drone-survey", label: "Drone Survey", icon: Plane },
  { to: "/officer/rtk", label: "RTK Verification", icon: Satellite },
  { to: "/officer/ai-discrepancy", label: "AI Discrepancy", icon: ScanSearch },
  { to: "/officer/evidence-conflict", label: "Evidence Conflict", icon: Scale },
  { to: "/officer/boundary-evolution", label: "Boundary Evolution", icon: History },
  { to: "/officer/cross-parcel", label: "Cross-Parcel Analysis", icon: Compass },
  { to: "/officer/confidence", label: "Verification Confidence", icon: Gauge },
  { to: "/officer/simulator", label: "Counterfactual Simulator", icon: BarChart3 },
  { to: "/officer/early-warning", label: "Dispute Early Warning", icon: AlertTriangle },
  { to: "/officer/priority", label: "Priority Engine", icon: ListOrdered },
  { to: "/officer/field-verification", label: "Field Verification", icon: ClipboardCheck },
  { to: "/officer/reports", label: "Reports", icon: FileText },
  { to: "/officer/audit-trail", label: "Audit Trail", icon: Activity },
] as const;

function OfficerLayout() {
  return (
    <OfficerProvider>
      <OfficerShell />
    </OfficerProvider>
  );
}

function OfficerShell() {
  const { isAuthenticated, hydrated, officerId, logout, selectedRecord } = useOfficer();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (!hydrated) {
    return <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Loading Officer Portal…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="max-w-sm rounded-lg border border-border bg-card p-6 text-center shadow-sm">
          <ShieldCheck className="mx-auto size-8 text-primary" />
          <h1 className="mt-3 text-lg font-bold text-brand-deep">Officer sign-in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please sign in with your Officer ID to access the verification workspace.</p>
          <Link
            to="/officer-login"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Go to Officer Login
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background lg:flex">
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
              <span className="mt-0.5 block text-[0.6rem] font-medium text-primary-foreground/70">Officer Portal</span>
            </span>
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-5 space-y-1" aria-label="Officer modules">
          {NAV.map(({ to, label, icon: Icon, ...rest }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                isActive(to, "exact" in rest ? rest.exact : false)
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate({ to: "/officer-login" });
            }}
            className="mt-2 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground/80 hover:bg-destructive/25"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </nav>
      </aside>

      {open ? <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-brand-deep/40 lg:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="size-6 text-brand-deep" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-brand-deep">Land Verification Workspace</p>
            <p className="truncate text-xs text-muted-foreground">
              Active record: Survey No. {selectedRecord.surveyNumber} · {selectedRecord.village}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <DemoBanner className="hidden xl:flex" />
            <span className="hidden text-right sm:block">
              <span className="block text-xs text-muted-foreground">Signed in as</span>
              <span className="block text-sm font-bold text-brand-deep">{officerId}</span>
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-primary">
              <ShieldCheck className="size-4" />
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 space-y-5 p-4 sm:p-6">
          <DemoBanner className="xl:hidden" />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
