import { FileText } from "lucide-react";

export type PdfPlaceholderProps = {
  message?: string;
};

export function PdfPlaceholder({
  message = "Select a paper to preview",
}: PdfPlaceholderProps) {
  return (
    <div className="grid min-h-[640px] place-items-center rounded-lg border bg-card p-8 text-center">
      <div className="grid justify-items-center gap-3">
        <div className="grid size-12 place-items-center rounded-lg bg-secondary text-ps-coral">
          <FileText className="size-6" />
        </div>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}
