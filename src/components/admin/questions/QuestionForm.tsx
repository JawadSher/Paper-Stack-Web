"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QuestionPreviewCard } from "@/components/admin/questions/QuestionPreviewCard";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import type { AdminQuestion } from "@/constants/admin-questions";
import type { ClassLevel } from "@/types";

const years = [2019, 2020, 2021, 2022, 2023, 2024];
const sectionTypes = ["short", "long", "mcq", "practical"] as const;

const schema = z.object({
  prompt: z.string().min(10),
  subjectId: z.string().min(1),
  classLevel: z.union([z.literal(9), z.literal(10), z.literal(11), z.literal(12)]),
  boardIds: z.array(z.string()).min(1),
  chapter: z.string().min(2),
  chapterId: z.string().min(2),
  yearsAppeared: z.array(z.number()).min(1),
  marks: z.coerce.number().optional(),
  sectionType: z.enum(sectionTypes),
});

type Values = z.infer<typeof schema>;

export type QuestionFormProps = {
  mode: "create" | "edit";
  initialQuestion?: AdminQuestion;
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function QuestionForm({ mode, initialQuestion }: QuestionFormProps) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      prompt: initialQuestion?.prompt ?? "",
      subjectId: initialQuestion?.subjectId ?? "class-10-physics",
      classLevel: initialQuestion?.classLevel ?? 10,
      boardIds: initialQuestion?.boardIds ?? [boards[0].id],
      chapter: initialQuestion?.chapter ?? "",
      chapterId: initialQuestion?.chapterId ?? "",
      yearsAppeared: initialQuestion?.yearsAppeared ?? [2024],
      marks: initialQuestion?.marks,
      sectionType: initialQuestion?.sectionType ?? "short",
    },
  });
  const values = form.watch();
  const classSubjects = useMemo(() => subjects.filter((subject) => subject.classLevel === values.classLevel), [values.classLevel]);

  useEffect(() => {
    if (values.chapter && !values.chapterId) form.setValue("chapterId", slugify(values.chapter));
  }, [form, values.chapter, values.chapterId]);

  function toggleBoard(id: string) {
    form.setValue("boardIds", values.boardIds.includes(id) ? values.boardIds.filter((item) => item !== id) : [...values.boardIds, id], { shouldValidate: true });
  }

  function toggleYear(year: number) {
    form.setValue("yearsAppeared", values.yearsAppeared.includes(year) ? values.yearsAppeared.filter((item) => item !== year) : [...values.yearsAppeared, year], { shouldValidate: true });
  }

  function onSubmit(data: Values) {
    console.log(`${mode} question`, data);
    toast.success(mode === "create" ? "Question created" : "Question saved");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(320px,0.4fr)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 rounded-lg border bg-card p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label={`Question text (${values.prompt.length} chars)`} error={form.formState.errors.prompt?.message}>
              <Textarea {...form.register("prompt")} className="min-h-32" />
            </Field>
          </div>
          <Field label="Class">
            <div className="grid grid-cols-4 gap-2">
              {([9, 10, 11, 12] as ClassLevel[]).map((classLevel) => (
                <Button key={classLevel} type="button" variant={values.classLevel === classLevel ? "default" : "outline"} onClick={() => form.setValue("classLevel", classLevel)}>
                  {classLevel}
                </Button>
              ))}
            </div>
          </Field>
          <Field label="Subject">
            <Controller control={form.control} name="subjectId" render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{classSubjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Boards">
              <div className="grid max-h-40 gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-2">
                {boards.map((board) => (
                  <label key={board.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={values.boardIds.includes(board.id)} onChange={() => toggleBoard(board.id)} className="size-4 accent-ps-coral" />
                    {board.shortName}
                  </label>
                ))}
              </div>
            </Field>
          </div>
          <Field label="Chapter name"><Input {...form.register("chapter")} placeholder="Chapter 3: Force and Motion" /></Field>
          <Field label="Chapter ID"><Input {...form.register("chapterId")} /></Field>
          <div className="md:col-span-2">
            <Field label="Years appeared">
              <div className="flex flex-wrap gap-2">
                {years.map((year) => <Button key={year} type="button" variant={values.yearsAppeared.includes(year) ? "default" : "outline"} onClick={() => toggleYear(year)}>{year}</Button>)}
              </div>
            </Field>
          </div>
          <Field label="Marks"><Input type="number" {...form.register("marks")} /></Field>
          <Field label="Section">
            <Controller control={form.control} name="sectionType" render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "short")}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{sectionTypes.map((type) => <SelectItem key={type} value={type}>{type === "mcq" ? "MCQ" : type}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </Field>
        </div>
        <div className="flex gap-3">
          <Button type="submit" className="bg-ps-coral hover:bg-ps-coral/90">{mode === "create" ? "Create question" : "Save changes"}</Button>
          <Button type="button" variant="ghost"><Link href="/questions">Cancel</Link></Button>
        </div>
      </form>
      <aside className="space-y-3">
        <h2 className="font-semibold">Preview</h2>
        <QuestionPreviewCard text={values.prompt} chapter={values.chapter} yearsAppeared={values.yearsAppeared} />
      </aside>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}{error ? <p className="text-sm text-destructive">{error}</p> : null}</div>;
}
