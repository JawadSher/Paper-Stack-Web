"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Document, Page, pdfjs } from "react-pdf";
import { FileText, Loader2, Upload } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BoardBadge } from "@/components/shared/BoardBadge";
import { SessionBadge } from "@/components/shared/SessionBadge";
import { SubjectIcon } from "@/components/shared/SubjectIcon";
import { YearBadge } from "@/components/shared/YearBadge";
import { useCreatePaper } from "@/hooks/admin/mutations/useCreatePaper";
import { useUploadPaperFile } from "@/hooks/admin/mutations/useUploadPaperFile";
import { useGetBoards } from "@/hooks/public/queries/useGetBoards";
import { useGetAllSubjects } from "@/hooks/public/queries/useGetAllSubjects";
import { cn } from "@/lib/utils";
import type { Board, ClassLevel, Paper, Subject } from "@/types";

const maxFileSize = 50 * 1024 * 1024;
const years = [2024, 2023, 2022, 2021, 2020, 2019];
const sessions: Array<NonNullable<Paper["session"]>> = [
  "annual",
  "supplementary",
  "model",
];

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const uploadSchema = z.object({
  file: z
    .instanceof(File, { message: "PDF file is required" })
    .refine((file) => file.type === "application/pdf", "Only PDF files are allowed")
    .refine((file) => file.size <= maxFileSize, "PDF must be 50MB or smaller"),
  boardId: z.string().min(1, "Board is required"),
  classLevel: z.union([z.literal(9), z.literal(10), z.literal(11), z.literal(12)]),
  subjectId: z.string().min(1, "Subject is required"),
  year: z.number().min(2019).max(2024),
  session: z.enum(["annual", "supplementary", "model"]),
  title: z.string().min(3, "Title is required"),
  status: z.enum(["draft", "live"]),
});

type UploadPaperValues = z.infer<typeof uploadSchema>;

function readableSize(bytes: number) {
  if (bytes < 1024) return `${bytes.toLocaleString()} bytes`;

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const precision = value >= 10 ? 1 : 2;
  return `${value.toFixed(precision)} ${units[unitIndex]} (${bytes.toLocaleString()} bytes)`;
}

export function UploadPaperForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [titleEdited, setTitleEdited] = useState(false);
  const { data: boards = [] } = useGetBoards();
  const { data: subjects = [] } = useGetAllSubjects();
  const createPaper = useCreatePaper();
  const uploadFile = useUploadPaperFile();
  const form = useForm<UploadPaperValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      boardId: boards[0]?.id ?? "",
      classLevel: 10,
      subjectId: subjects[0]?.id ?? "",
      year: 2024,
      session: "annual",
      title: "",
      status: "draft",
    },
  });

  const values = form.watch();
  const selectedBoardData = boards.find((board) => board.id === values.boardId) ?? boards[0];
  const classSubjects = useMemo(
    () => subjects,
    [subjects],
  );
  const selectedSubjectData =
    subjects.find((subject) => subject.id === values.subjectId) ?? classSubjects[0];
  const selectedBoard = useMemo<Board | undefined>(
    () =>
      selectedBoardData
        ? {
            id: selectedBoardData.id,
            name: selectedBoardData.name,
            shortName: selectedBoardData.shortName,
            description: selectedBoardData.description ?? "",
            province:
              selectedBoardData.province === "Gilgit_Baltistan"
                ? "Gilgit-Baltistan"
                : (selectedBoardData.province as Board["province"]),
            classes: selectedBoardData.classes as Board["classes"],
            color: selectedBoardData.color,
          }
        : undefined,
    [selectedBoardData],
  );
  const selectedSubject = useMemo<Subject | undefined>(
    () =>
      selectedSubjectData
        ? {
            id: selectedSubjectData.id,
            name: selectedSubjectData.name,
            classLevel: values.classLevel,
          }
        : undefined,
    [selectedSubjectData, values.classLevel],
  );
  const selectedFile = values.file;

  useEffect(() => {
    if (!values.boardId && boards[0]) {
      form.setValue("boardId", boards[0].id, { shouldValidate: true });
    }
  }, [boards, form, values.boardId]);

  useEffect(() => {
    if (!classSubjects.some((subject) => subject.id === values.subjectId)) {
      form.setValue("subjectId", classSubjects[0]?.id ?? "", {
        shouldValidate: true,
      });
    }
  }, [classSubjects, form, values.subjectId]);

  useEffect(() => {
    if (titleEdited || !selectedBoard || !selectedSubject) return;
    const sessionLabel =
      values.session === "supplementary" ? "Supplementary" : values.session[0].toUpperCase() + values.session.slice(1);
    form.setValue(
      "title",
      `${selectedSubject.name} ${values.year} ${sessionLabel} Paper - ${selectedBoard.shortName}`,
    );
  }, [form, selectedBoard, selectedSubject, titleEdited, values.session, values.year]);

  async function onSubmit(data: UploadPaperValues) {
    setProgress(15);
    const created = await createPaper.mutateAsync({
      boardId: data.boardId,
      subjectId: data.subjectId,
      classLevel: data.classLevel,
      year: data.year,
      session: data.session,
      title: data.title,
      status: data.status === "live" ? "LIVE" : "DRAFT",
    });
    if (!created.success) return;

    setProgress(55);
    const formData = new FormData();
    formData.set("file", data.file);
    const uploaded = await uploadFile.mutateAsync({
      paperId: created.data.id,
      formData,
    });
    if (uploaded.success) {
      setProgress(100);
      router.push("/papers");
    }
  }

  function setFile(file?: File) {
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
    }
  }

  const isPending = createPaper.isPending || uploadFile.isPending;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(320px,0.4fr)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "grid cursor-pointer place-items-center rounded-lg border border-dashed bg-card p-8 text-center transition-colors hover:border-ps-coral",
            form.formState.errors.file && "border-destructive",
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0])}
          />
          <Upload className="size-9 text-ps-coral" />
          <p className="mt-4 font-medium">
            {selectedFile ? selectedFile.name : "Drag PDF here or click to browse"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedFile ? readableSize(selectedFile.size) : "PDF only, max 50MB"}
          </p>
          {form.formState.errors.file ? (
            <p className="mt-3 text-sm text-destructive">
              {form.formState.errors.file.message}
            </p>
          ) : null}
        </div>

        {progress > 0 ? <Progress value={progress} /> : null}

        <div className="grid gap-4 rounded-lg border bg-card p-5 md:grid-cols-2">
          <Field label="Board" error={form.formState.errors.boardId?.message}>
            <Controller
              control={form.control}
              name="boardId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {selectedBoardData?.shortName ?? "Select board"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>{board.shortName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Class">
            <div className="grid grid-cols-4 gap-2">
              {([9, 10, 11, 12] as ClassLevel[]).map((classLevel) => (
                <Button
                  key={classLevel}
                  type="button"
                  variant={values.classLevel === classLevel ? "default" : "outline"}
                  onClick={() => form.setValue("classLevel", classLevel, { shouldValidate: true })}
                >
                  {classLevel}
                </Button>
              ))}
            </div>
          </Field>

          <Field label="Subject" error={form.formState.errors.subjectId?.message}>
            <Controller
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {selectedSubjectData?.name ?? "Select subject"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {classSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Year">
            <Controller
              control={form.control}
              name="year"
              render={({ field }) => (
                <Select value={String(field.value)} onValueChange={(value) => field.onChange(Number(value))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Session">
            <div className="flex flex-wrap gap-2">
              {sessions.map((session) => (
                <Button
                  key={session}
                  type="button"
                  variant={values.session === session ? "default" : "outline"}
                  className="capitalize"
                  onClick={() => form.setValue("session", session, { shouldValidate: true })}
                >
                  {session === "supplementary" ? "Supplementary" : session}
                </Button>
              ))}
            </div>
          </Field>

          <Field label="Status">
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Paper title" error={form.formState.errors.title?.message}>
              <Input
                {...form.register("title")}
                onChange={(event) => {
                  setTitleEdited(true);
                  form.setValue("title", event.target.value, { shouldValidate: true });
                }}
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="bg-ps-coral hover:bg-ps-coral/90" disabled={form.formState.isSubmitting || isPending}>
            {form.formState.isSubmitting || uploadFile.isPending || createPaper.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Upload paper
          </Button>
          <Button type="button" variant="ghost">
            <Link href="/papers">Cancel</Link>
          </Button>
        </div>
      </form>

      <aside className="space-y-3">
        <h2 className="font-semibold">Preview</h2>
        <UploadPreview
          file={selectedFile}
          title={values.title || "Paper preview"}
          board={selectedBoard}
          subjectName={selectedSubject?.name}
          classLevel={values.classLevel}
          year={values.year}
          session={values.session}
        />
      </aside>
    </div>
  );
}

function UploadPreview({
  file,
  title,
  board,
  subjectName,
  classLevel,
  year,
  session,
}: {
  file?: File;
  title: string;
  board?: Board;
  subjectName?: string;
  classLevel: ClassLevel;
  year: number;
  session: NonNullable<Paper["session"]>;
}) {
  const [loadError, setLoadError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const accentColor = board?.color ?? "var(--ps-coral)";
  const displaySubject = subjectName ?? title;

  useEffect(() => {
    if (!file) {
      setPreviewUrl(undefined);
      setLoadError(false);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setLoadError(false);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div
      className="overflow-hidden rounded-lg border bg-card shadow-sm"
      style={
        {
          "--upload-preview-accent": accentColor,
          "--upload-preview-soft": `color-mix(in srgb, ${accentColor} 12%, transparent)`,
          "--upload-preview-wash": `color-mix(in srgb, ${accentColor} 7%, var(--card))`,
        } as React.CSSProperties
      }
    >
      <div className="space-y-3 border-b p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-(--upload-preview-soft) text-(--upload-preview-accent)">
            <SubjectIcon subjectName={displaySubject} size={21} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{displaySubject}</p>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {board ? <BoardBadge board={board} size="md" /> : null}
          <YearBadge year={year} />
          <span className="rounded-4xl bg-(--upload-preview-soft) px-2 py-0.5 text-xs font-medium text-(--upload-preview-accent)">
            Class {classLevel}
          </span>
          <SessionBadge session={session} />
        </div>
        {file ? (
          <p className="truncate text-sm text-muted-foreground">
            {file.name} - {readableSize(file.size)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add a PDF to see a short document preview here.
          </p>
        )}
      </div>

      <div className="grid min-h-[420px] place-items-center bg-background p-4">
        {previewUrl ? (
          loadError ? (
            <div className="max-w-64 text-center text-sm text-muted-foreground">
              Could not load a local preview for this PDF.
            </div>
          ) : (
            <Document
              file={previewUrl}
              loading={<Skeleton className="h-[360px] w-[255px]" />}
              error={null}
              onLoadError={() => setLoadError(true)}
              onLoadSuccess={() => setLoadError(false)}
            >
              <Page
                pageNumber={1}
                width={255}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={<Skeleton className="h-[360px] w-[255px]" />}
              />
            </Document>
          )
        ) : (
          <div className="grid justify-items-center gap-3 text-center text-sm text-muted-foreground">
            <FileText className="size-10 text-(--upload-preview-accent)" />
            <span>No file selected</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
