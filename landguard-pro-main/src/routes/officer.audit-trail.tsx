import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";

import { EmptyState, PageHeader, Panel, Tag } from "@/components/officer/shell";
import { useOfficer } from "@/lib/officer/store";

export const Route = createFileRoute("/officer/audit-trail")({
  component: AuditTrail,
});

const tone = (status: string) => (status === "Success" ? "good" : status === "Attention" ? "bad" : "muted") as "good" | "bad" | "muted";

function AuditTrail() {
  const { audit } = useOfficer();

  return (
    <>
      <PageHeader title="Audit Trail" description="Chronological log of Officer actions in this workspace." icon={Activity} />

      <Panel title={`Recorded actions (${audit.length})`}>
        {audit.length === 0 ? (
          <EmptyState message="No Officer actions have been recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-secondary text-left text-xs font-bold uppercase tracking-wide text-brand-deep">
                  <th className="px-3 py-3">User</th>
                  <th className="px-3 py-3">Action</th>
                  <th className="px-3 py-3">Survey No.</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Time</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((entry) => {
                  const when = new Date(entry.timestamp);
                  return (
                    <tr key={entry.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-3 font-bold text-brand-deep">{entry.user}</td>
                      <td className="px-3 py-3">{entry.action}</td>
                      <td className="px-3 py-3">{entry.surveyNumber}</td>
                      <td className="px-3 py-3">{when.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      <td className="px-3 py-3">{when.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</td>
                      <td className="px-3 py-3">
                        <Tag tone={tone(entry.status)}>{entry.status}</Tag>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
