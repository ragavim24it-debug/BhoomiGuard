import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Home, LogOut, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";

import { DemoNotice, InfoRow, PageHeader, Panel } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { formatAcres } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/profile")({
  component: CitizenProfilePage,
});

function CitizenProfilePage() {
  const { currentProfile, lands, logout, switchDemoCitizen, citizenId } = useCitizen();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/citizen-login" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Citizen Profile"
        description="Your registered identity, authorized land holdings, and account credentials."
        icon={User}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div className="text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-secondary text-primary font-black text-2xl">
              {currentProfile?.full_name.charAt(0) ?? "C"}
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-brand-deep">{currentProfile?.full_name}</h2>
            <p className="text-xs text-muted-foreground">Authorized Citizen Landholder</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="size-3.5" /> Identity Verified
            </span>
          </div>

          <div className="space-y-3 border-t border-border pt-4 text-xs">
            <div className="flex items-center gap-2.5 text-brand-deep">
              <Mail className="size-4 text-muted-foreground shrink-0" />
              <span className="truncate font-medium">{currentProfile?.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-brand-deep">
              <Phone className="size-4 text-muted-foreground shrink-0" />
              <span className="font-medium">{currentProfile?.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-brand-deep">
              <MapPin className="size-4 text-muted-foreground shrink-0" />
              <span className="font-medium">{currentProfile?.village} Village</span>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
              Demo Citizen Switcher
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={citizenId === "citizen-01" ? "default" : "outline"}
                size="sm"
                onClick={() => switchDemoCitizen("citizen-01")}
                className="text-xs font-bold h-9"
              >
                Citizen 01
              </Button>
              <Button
                variant={citizenId === "citizen-02" ? "default" : "outline"}
                size="sm"
                onClick={() => switchDemoCitizen("citizen-02")}
                className="text-xs font-bold h-9"
              >
                Citizen 02
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full text-xs font-bold text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <LogOut className="size-3.5 mr-1.5" /> Logout from Citizen Portal
          </Button>
        </div>

        {/* Authorized Holdings Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Panel
            title="Authorized Land Holdings"
            subtitle="Government cadastral parcels linked to this verified citizen profile"
          >
            <div className="space-y-4">
              {lands.map((land) => (
                <div
                  key={land.id}
                  className="rounded-xl border border-border bg-background/60 p-4 transition-all hover:border-primary/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-brand-deep">
                        Survey No. {land.survey_number}
                      </span>
                      <span className="rounded bg-secondary px-2 py-0.5 text-[0.65rem] font-bold text-brand-deep">
                        Patta No. {land.patta_number}
                      </span>
                    </div>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {land.verification_status}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-3 text-xs">
                    <div>
                      <span className="text-muted-foreground uppercase text-[0.65rem] font-semibold">Location</span>
                      <p className="font-bold text-brand-deep">{land.village}, {land.taluk}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[0.65rem] font-semibold">Government Area</span>
                      <p className="font-bold text-brand-deep">{formatAcres(land.government_area)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[0.65rem] font-semibold">Surveyed Area</span>
                      <p className="font-bold text-brand-deep">{formatAcres(land.surveyed_area)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Security & Public Transparency Policy">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your profile grants authorized citizen access to public land measurement facts, survey timestamps, and official status notices. In compliance with BhoomiGuard governance standards, sensitive revenue department audit trails and officer priority models are excluded from public citizen views.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
