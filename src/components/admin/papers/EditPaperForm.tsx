"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaperCard } from "@/components/shared/PaperCard";
import { boards } from "@/constants/boards";
import {
  formatFileSize,
  type AdminPaper,
  type PaperStatus,
} from "@/constants/admin-papers";
import { subjects } from "@/constants/subjects";
import type { ClassLevel, Paper } from "@/types";

const years = [2024, 2023, 2022, 2021, 2020, 2019];
const sessions: Array<NonNullable<Paper["session"]>> = [
  "annual",
  "supplementary",
  "model",
];

const editSchema = z.object({
  boardId: z.string().min(1, "Board is required"),
  classLevel: z.union([z.literal(9), z.literal(10), z.literal(11), z.literal(12)]),
  subjectId: z.string().min(1, "Subject is required"),
  year: z.number().min(2019).max(2024),
  session: z.enum(["annual", "supplementary", "model"]),
  title: z.string().min(3, "Title is required"),
  status: z.enum(["draft", "live", "processing"]),
  replacementFile: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.type === "application/pdf", "Only PDF files are allowed")
    .refine((file) => !file || file.size <= 50 * 1024 * 1024, "PDF must be 50MB or smaller"),
});

type EditPaperValues = z.infer<typeof editSchema>;

export type EditPaperFormProps = {
  paper: AdminPaper;
};

export function EditPaperForm({ paper }: EditPaperFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const form = useForm<EditPaperValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      boardId: paper.boardId,
      classLevel: paper.classLevel,
      subjectId: paper.subjectId,
      year: paper.year,
      session: paper.session ?? "annual",
      title: paper.title,
      status: paper.status,
    },
  });

  const values = form.watch();
  const selectedBoard = boards.find((board) => board.id === values.boardId) ?? boards[0];
  const classSubjects = useMemo(
    () => subjects.filter((subject) => subject.classLevel === values.classLevel),
    [values.classLevel],
  );
  const selectedSubject =
    subjects.find((subject) => subject.id === values.subjectId) ?? classSubjects[0];

  useEffect(() => {
    if (!classSubjects.some((subject) => subject.id === values.subjectId)) {
      form.setValue("subjectId", classSubjects[0]?.id ?? "");
    }
  }, [classSubjects, form, values.subjectId]);

  async function onSubmit(data: EditPaperValues) {
    setSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    console.log("Save paper changes", data);
    toast.success("Paper changes saved");
    setSaving(false);
  }

  const previewPaper: Paper = {
    ...paper,
    title: values.title,
    boardId: values.boardId,
    subjectId: values.subjectId,
    classLevel: values.classLevel,
    year: Number(values.year),
    session: values.session,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(320px,0.4fr)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Current file</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {paper.fileName} - {formatFileSize(paper.fileSizeBytes)}
              </p>
              {values.replacementFile ? (
                <p className="mt-2 text-sm text-ps-coral">
                  Replacement: {values.replacementFile.name}
                </p>
              ) : null}
            </div>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              Replace PDF
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(event) =>
                form.setValue("replacementFile", event.target.files?.[0], {
                  shouldValidate: true,
                })
              }
            />
          </div>
          {form.formState.errors.replacementFile ? (
            <p className="mt-3 text-sm text-destructive">
              {form.formState.errors.replacementFile.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 rounded-lg border bg-card p-5 md:grid-cols-2">
          <Field label="Board" error={form.formState.errors.boardId?.message}>
            <Controller
              control={form.control}
              name="boardId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
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
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
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
                <Select value={field.value} onValueChange={(value) => field.onChange(value as PaperStatus)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Paper title" error={form.formState.errors.title?.message}>
              <Input {...form.register("title")} />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="bg-ps-coral hover:bg-ps-coral/90" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </Button>
          <Button type="button" variant="ghost">
            <Link href="/papers">Cancel</Link>
          </Button>
        </div>

        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
          <h2 className="font-semibold text-destructive">Danger zone</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Delete this paper and its metadata from PaperStack.
          </p>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button type="button" variant="destructive" className="mt-4">
                  <Trash2 className="size-4" />
                  Delete this paper
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this paper?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will be permanent once Supabase deletion is wired.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    console.log("Delete paper", paper.id);
                    toast.success("Paper delete queued");
                  }}
                >
                  Delete paper
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>

      <aside className="space-y-3">
        <h2 className="font-semibold">Preview</h2>
        {selectedBoard && selectedSubject ? (
          <PaperCard paper={previewPaper} board={selectedBoard} subject={selectedSubject} />
        ) : null}
      </aside>
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
