import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, FileCheck, FileText, Info, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { DemoNotice, PageHeader, Panel, SelectedLandBar } from "@/components/citizen/shell";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/citizen/data";
import { useCitizen } from "@/lib/citizen/store";

export const Route = createFileRoute("/citizen/documents")({
  component: DocumentsPage,
});

function DocumentsPage() {
  const { selectedLand, documents } = useCitizen();
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  if (!selectedLand) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Please select a land parcel to view authorized documents.
      </div>
    );
  }

  const handleDownload = (title: string) => {
    window.alert(`Downloading authorized public copy of "${title}" (Simulated demo file).`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authorized Public Documents"
        description="Publicly verified government records, Patta extracts, and cadastral survey certificates for this parcel."
        icon={FileText}
        action={<DemoNotice text="DEMO DATA" />}
      />

      <SelectedLandBar />

      <Panel
        title={`Land Records: Survey No. ${selectedLand.survey_number}`}
        subtitle="Documents issued and certified by the Revenue & Survey Department"
      >
        {documents.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">No documents loaded for this parcel.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/50"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                      <FileCheck className="size-5" />
                    </span>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold text-primary">
                      {doc.document_type}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-extrabold text-brand-deep leading-snug">
                    {doc.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ref: <span className="font-mono font-medium text-brand-deep">{doc.reference || "N/A"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Issued: {formatDate(doc.issued_on)}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveDoc(doc.title)}
                    className="h-8 flex-1 text-xs font-semibold gap-1"
                  >
                    <Eye className="size-3.5" /> View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleDownload(doc.title)}
                    className="h-8 flex-1 text-xs font-bold gap-1"
                  >
                    <Download className="size-3.5" /> Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Simulated Document Viewer Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="size-5 text-primary" />
                <h3 className="font-bold text-brand-deep">{activeDoc}</h3>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="text-muted-foreground hover:text-brand-deep text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-6 rounded-lg border border-dashed border-primary/40 bg-secondary/30 p-6 text-center">
              <ShieldCheck className="mx-auto size-12 text-primary" />
              <p className="mt-3 text-sm font-bold text-brand-deep">Authorized Public Document Preview</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Survey No. {selectedLand.survey_number} · Village: {selectedLand.village}
              </p>
              <div className="mt-4 inline-block rounded bg-card px-3 py-1.5 text-xs font-mono text-brand-deep border border-border">
                Govt Extent: {selectedLand.government_area} acres | Survey: {selectedLand.surveyed_area} acres
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveDoc(null)}>
                Close
              </Button>
              <Button variant="default" size="sm" onClick={() => handleDownload(activeDoc)}>
                <Download className="size-3.5 mr-1" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-primary/20 bg-secondary/50 p-4 flex items-start gap-3">
        <Info className="size-5 shrink-0 text-brand-bright mt-0.5" />
        <div className="text-xs text-brand-deep leading-relaxed">
          <p className="font-bold">Public Record Authentication:</p>
          <p>
            All document extracts provided here are read-only authorized public records. Confidential department audit notes, internal risk profiles, and surveyor private notes are not accessible to public users.
          </p>
        </div>
      </div>
    </div>
  );
}
