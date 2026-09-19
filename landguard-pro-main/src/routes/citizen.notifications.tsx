import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Bell, Check, CheckCheck, FileText, Info, Layers } from "lucide-react";

import { DemoNotice, PageHeader, Panel } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/notifications")({
  component: CitizenNotificationsPage,
});

function CitizenNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCitizen();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Verification":
        return <AlertCircle className="size-4 text-destructive" />;
      case "Survey":
        return <Layers className="size-4 text-primary" />;
      case "Request":
        return <FileText className="size-4 text-brand-bright" />;
      default:
        return <Info className="size-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="Important Notifications"
          description="Recent updates regarding your land records, survey completions, and submitted requests."
          icon={Bell}
        />
        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.is_read) && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllNotificationsRead}
              className="font-semibold gap-1.5 text-xs"
            >
              <CheckCheck className="size-4" /> Mark All as Read
            </Button>
          )}
          <DemoNotice text="DEMO DATA" />
        </div>
      </div>

      <Panel title="Recent Land Updates" subtitle="Official notices and milestone alerts">
        {notifications.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">No notifications at this time.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border p-4 transition-all ${
                  notif.is_read
                    ? "border-border/60 bg-card/60 opacity-85"
                    : "border-primary/40 bg-secondary/30 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-secondary">
                    {getCategoryIcon(notif.category)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-extrabold text-brand-deep">{notif.title}</h4>
                      <span className="rounded bg-background px-1.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground border border-border">
                        {notif.category}
                      </span>
                      {!notif.is_read && (
                        <span className="grid size-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-brand-deep/80 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-[0.65rem] text-muted-foreground">
                      {formatDate(notif.created_at)}
                    </p>
                  </div>
                </div>

                {!notif.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markNotificationRead(notif.id)}
                    className="h-8 text-xs font-semibold text-primary self-end sm:self-center shrink-0"
                  >
                    <Check className="size-3.5 mr-1" /> Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
