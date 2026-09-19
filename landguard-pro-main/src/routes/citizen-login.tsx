import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, MapPin, User, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { DemoNotice } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CitizenProvider, DEMO_PROFILES, useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen-login")({
  head: () => ({
    meta: [
      { title: "Citizen Portal Login | BHOOMIGUARD" },
      { name: "description", content: "Citizen land verification login for BHOOMIGUARD." },
      { property: "og:title", content: "Citizen Portal Login | BHOOMIGUARD" },
      { property: "og:description", content: "Access your authorized land verification records." },
    ],
  }),
  component: () => (
    <CitizenProvider>
      <CitizenLogin />
    </CitizenProvider>
  ),
});

function CitizenLogin() {
  const { login, switchDemoCitizen } = useCitizen();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("citizen01@bhoomiguard.in");
  const [password, setPassword] = useState("••••••••");
  const [show, setShow] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string>("citizen-01");

  const handleSelectDemo = (id: string) => {
    setSelectedDemo(id);
    const prof = DEMO_PROFILES.find((p) => p.id === id);
    if (prof) {
      setIdentifier(prof.email);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const citizenId = selectedDemo || "citizen-01";
    switchDemoCitizen(citizenId);
    login(citizenId);
    navigate({ to: "/citizen" });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto mb-6 flex w-fit items-center gap-2.5">
          <span className="relative grid size-12 place-items-center text-primary">
            <Leaf className="absolute bottom-0 left-0 size-9 rotate-[-28deg] fill-brand-soft stroke-primary" />
            <MapPin className="absolute right-0 top-0 size-9 fill-card stroke-brand-deep" strokeWidth={2.4} />
          </span>
          <span>
            <span className="block text-xl font-extrabold leading-none text-brand-deep">
              BHOOMI<span className="text-brand-bright">GUARD</span>
            </span>
            <span className="mt-1 block text-[0.65rem] font-medium text-brand-deep/80">Citizen Land Portal</span>
          </span>
        </Link>

        <div className="rounded-lg border border-border bg-card p-6 shadow-login sm:p-8">
          <div className="text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-secondary text-primary">
              <User className="size-5" />
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-brand-deep">Citizen Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to view your authorized land records</p>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Select Demo Citizen Profile</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemo("citizen-01")}
                className={`flex flex-col items-start rounded-md border p-2.5 text-left text-xs transition-colors ${
                  selectedDemo === "citizen-01"
                    ? "border-primary bg-secondary/80 font-bold text-brand-deep shadow-xs"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <span className="flex items-center gap-1 font-extrabold text-brand-deep">
                  {selectedDemo === "citizen-01" && <CheckCircle2 className="size-3 text-primary" />}
                  Demo Citizen 01
                </span>
                <span className="text-[0.7rem] text-muted-foreground">Surveys 245/3, 247/2</span>
                <span className="text-[0.65rem] font-medium text-brand-bright">Kannampalayam</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo("citizen-02")}
                className={`flex flex-col items-start rounded-md border p-2.5 text-left text-xs transition-colors ${
                  selectedDemo === "citizen-02"
                    ? "border-primary bg-secondary/80 font-bold text-brand-deep shadow-xs"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <span className="flex items-center gap-1 font-extrabold text-brand-deep">
                  {selectedDemo === "citizen-02" && <CheckCircle2 className="size-3 text-primary" />}
                  Demo Citizen 02
                </span>
                <span className="text-[0.7rem] text-muted-foreground">Surveys 250/1, 251/4</span>
                <span className="text-[0.65rem] font-medium text-brand-bright">Ingur Village</span>
              </button>
            </div>
          </div>

          <form className="mt-5 space-y-4" onSubmit={submit}>
            <label className="relative block">
              <span className="sr-only">Email or Phone</span>
              <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-deep" />
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                name="identifier"
                autoComplete="username"
                placeholder="Mobile / Email / Patta No."
                className="h-12 bg-card pl-11 text-sm font-medium"
                required
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Password</span>
              <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-deep" />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                className="h-12 bg-card px-11"
                required
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </label>

            <Button type="submit" variant="hero" className="h-12 w-full text-base">
              Enter Citizen Portal <ArrowRight />
            </Button>

            <div className="flex justify-between text-xs sm:text-sm">
              <Link to="/officer-login" className="font-medium text-primary hover:underline">
                Officer Login instead
              </Link>
              <Link to="/" className="font-medium text-brand-deep hover:underline">
                Back to Home
              </Link>
            </div>
          </form>

          <DemoNotice className="mt-6" />
        </div>
      </div>
    </main>
  );
}
