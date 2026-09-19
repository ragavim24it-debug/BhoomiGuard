import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  Leaf,
  LockKeyhole,
  Map,
  MapPin,
  Play,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import farmlandImage from "@/assets/bhoomiguard-farmland.jpg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BHOOMIGUARD | AI Land Verification" },
      {
        name: "description",
        content: "AI-powered verification of government land records using drone, RTK and digital mapping.",
      },
      { property: "og:title", content: "BHOOMIGUARD | AI Land Verification" },
      {
        property: "og:description",
        content: "Smarter land verification for stronger rural governance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Brand() {
  return (
    <div className="flex items-center gap-2.5" aria-label="BHOOMIGUARD">
      <span className="relative grid size-12 shrink-0 place-items-center text-primary sm:size-14">
        <Leaf className="absolute bottom-0 left-0 size-9 rotate-[-28deg] fill-brand-soft stroke-primary" />
        <MapPin className="absolute right-0 top-0 size-9 fill-card stroke-brand-deep" strokeWidth={2.4} />
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap text-xl font-extrabold leading-none text-brand-deep sm:text-[1.75rem]">
          BHOOMI<span className="text-brand-bright">GUARD</span>
        </span>
        <span className="mt-1 hidden whitespace-nowrap text-[0.65rem] font-medium text-brand-deep/80 sm:block">
          AI-Driven Rural Land Survey &amp; Digital Boundary Mapping
        </span>
      </span>
    </div>
  );
}

function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const focusLogin = () => document.getElementById("username")?.focus();
  const unavailable = (label: string) => window.alert(`${label} will be available soon.`);
  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.alert("Secure login will be connected in the next phase.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background font-sans">
      <img
        src={farmlandImage}
        alt="Drone surveying rural farmland with digitally mapped land boundaries"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-hero-wash" aria-hidden="true" />
      <div className="absolute -bottom-[26%] -left-[12%] h-[48%] w-[78%] rounded-[50%] bg-brand-deep/95" aria-hidden="true" />
      <div className="absolute -bottom-[34%] -right-[18%] h-[49%] w-[74%] rounded-[50%] bg-background/85" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-5 pb-7 pt-4 sm:px-8 lg:px-12 lg:pt-5 xl:px-14">
        <header className="flex items-center justify-between">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-brand-deep md:flex" aria-label="Primary navigation">
            <a href="#home" className="flex items-center gap-2 text-primary transition-colors hover:text-brand-bright">
              <Home className="size-4" /> Home
            </a>
            <span className="h-5 w-px bg-border" aria-hidden="true" />
            <button type="button" onClick={() => navigate({ to: "/citizen-login" })} className="flex cursor-pointer items-center gap-2 transition-colors hover:text-primary">
              <User className="size-4" /> Citizen View
            </button>
            <button type="button" onClick={() => navigate({ to: "/officer-login" })} className="flex cursor-pointer items-center gap-2 transition-colors hover:text-primary">
              <ShieldCheck className="size-4" /> Officer Login
            </button>
          </nav>
        </header>

        <section id="home" className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(390px,0.75fr)] lg:py-4 xl:gap-16">
          <div className="max-w-[720px] pt-4 lg:self-start lg:pt-16 xl:pt-20">
            <h1 className="text-4xl font-extrabold leading-[1.08] text-brand-deep sm:text-5xl xl:text-6xl">
              Smarter Land Verification.
              <span className="mt-1 block text-brand-bright">Stronger Rural Governance.</span>
            </h1>
            <p className="mt-5 max-w-[650px] text-base font-medium leading-7 text-brand-deep/85 sm:text-lg">
              AI-powered verification of government land records using Drone, RTK and digital mapping to identify boundary and area discrepancies.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button type="button" variant="hero" size="lg" onClick={focusLogin} className="h-12 px-6">
                <Search /> Verify Land <ArrowRight />
              </Button>
              <Button type="button" variant="heroOutline" size="lg" onClick={() => unavailable("Explore Map")} className="h-12 px-6">
                <Map /> Explore Map <ArrowRight />
              </Button>
              <Button type="button" variant="heroOutline" size="lg" onClick={() => unavailable("View Demo")} className="h-12 px-6">
                <Play className="fill-current" /> View Demo <ArrowRight />
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[500px] rounded-lg border border-card/80 bg-card/95 p-6 shadow-login backdrop-blur-sm sm:p-8 lg:mx-0 lg:justify-self-end">
            <div className="mb-6 flex justify-center"><Brand /></div>
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-brand-deep sm:text-3xl">Welcome Back</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to access the land verification system</p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={submitLogin}>
              <label className="relative block">
                <span className="sr-only">Username or Email</span>
                <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-deep" />
                <Input id="username" name="username" type="text" autoComplete="username" required placeholder="Username / Email" className="h-12 bg-card pl-11" />
              </label>
              <label className="relative block">
                <span className="sr-only">Password</span>
                <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-deep" />
                <Input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Password" className="h-12 bg-card px-11" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary">
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </label>

              <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-brand-deep"><Checkbox /> Remember Me</label>
                <button type="button" onClick={() => unavailable("Password recovery")} className="cursor-pointer font-medium text-primary hover:underline">Forgot Password?</button>
              </div>

              <Button type="submit" variant="hero" className="h-12 w-full text-base">Login <ArrowRight /></Button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><span>OR</span><span className="h-px flex-1 bg-border" /></div>

              <Button type="button" variant="loginOutline" onClick={() => navigate({ to: "/citizen-login" })} className="h-11 w-full"><User /> Citizen View <ArrowRight className="ml-auto" /></Button>
              <Button type="button" variant="loginOutline" onClick={() => navigate({ to: "/officer-login" })} className="h-11 w-full bg-secondary/60"><ShieldCheck /> Officer Login <ArrowRight className="ml-auto" /></Button>

              <div className="flex items-center justify-center gap-3 pt-1 text-[0.65rem] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-brand-deep" /> <span>Secure</span><span>|</span><span>Government</span><span>|</span><span>Transparent</span>
              </div>
            </form>
          </div>
        </section>

        <div className="relative hidden max-w-[380px] items-center gap-4 pb-2 text-primary-foreground lg:flex">
          <Leaf className="size-10" />
          <p className="text-base font-semibold leading-6">From traditional land records<br />to intelligent digital verification.</p>
        </div>
      </div>
    </main>
  );
}
