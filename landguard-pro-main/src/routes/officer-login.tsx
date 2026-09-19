import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, IdCard, Leaf, LockKeyhole, MapPin, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { DemoBanner } from "@/components/officer/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OfficerProvider, useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer-login")({
  head: () => ({
    meta: [
      { title: "Officer Login | BHOOMIGUARD" },
      { name: "description", content: "Secure Officer login for the BHOOMIGUARD land verification portal." },
      { property: "og:title", content: "Officer Login | BHOOMIGUARD" },
      { property: "og:description", content: "Secure Officer login for the BHOOMIGUARD land verification portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <OfficerProvider>
      <OfficerLogin />
    </OfficerProvider>
  ),
});

function OfficerLogin() {
  const { login } = useOfficer();
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (officerId.trim().length < 3 || password.length < 4) {
      setError("Enter a valid Officer ID and a password of at least 4 characters.");
      return;
    }
    setError(null);
    login(officerId.trim().toUpperCase());
    navigate({ to: "/officer" });
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
            <span className="mt-1 block text-[0.65rem] font-medium text-brand-deep/80">Officer Portal Access</span>
          </span>
        </Link>

        <div className="rounded-lg border border-border bg-card p-6 shadow-login sm:p-8">
          <div className="text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-secondary text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-brand-deep">Officer Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in with your government-issued Officer ID</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="relative block">
              <span className="sr-only">Officer ID</span>
              <IdCard className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-deep" />
              <Input
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                name="officerId"
                autoComplete="username"
                placeholder="Officer ID"
                className="h-12 bg-card pl-11"
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

            {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
            {notice ? <p className="text-sm font-semibold text-primary">{notice}</p> : null}

            <Button type="submit" variant="hero" className="h-12 w-full text-base">
              Login <ArrowRight />
            </Button>

            <div className="flex justify-between text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setNotice("Password recovery is handled by your district administrator.")}
                className="font-medium text-primary hover:underline"
              >
                Forgot Password?
              </button>
              <Link to="/" className="font-medium text-brand-deep hover:underline">
                Back to Home
              </Link>
            </div>
          </form>

          <DemoBanner className="mt-6" />
        </div>
      </div>
    </main>
  );
}
