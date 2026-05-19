"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Atom,
  BarChart2,
  BookOpen,
  Brain,
  Calculator,
  Dumbbell,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Monitor,
  Music,
  Palette,
  Scale,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import type { ClassLevel } from "@/types";
import type { AdminSubject, SubjectIconName } from "@/constants/admin-subjects";

const iconNames = [
  "Atom",
  "FlaskConical",
  "Calculator",
  "BookOpen",
  "Globe",
  "Monitor",
  "Languages",
  "Landmark",
  "TrendingUp",
  "BarChart2",
  "Brain",
  "Users",
  "Music",
  "Palette",
  "Dumbbell",
  "Scale",
] as const satisfies readonly [SubjectIconName, ...SubjectIconName[]];

const iconMap: Record<SubjectIconName, LucideIcon> = {
  Atom,
  FlaskConical,
  Calculator,
  BookOpen,
  Globe,
  Monitor,
  Languages,
  Landmark,
  TrendingUp,
  BarChart2,
  Brain,
  Users,
  Music,
  Palette,
  Dumbbell,
  Scale,
};

const classLevels: ClassLevel[] = [9, 10, 11, 12];

const subjectSchema = z.object({
  name: z.string().min(2).max(80),
  icon: z.enum(iconNames),
  classes: z.array(z.union([z.literal(9), z.literal(10), z.literal(11), z.literal(12)])).min(1),
  isCompulsory: z.boolean(),
  displayOrder: z.coerce.number().min(1),
  status: z.enum(["active", "inactive"]),
});

type SubjectValues = z.infer<typeof subjectSchema>;

export type SubjectFormProps = {
  mode: "create" | "edit";
  initialSubject?: AdminSubject;
};

export function SubjectForm({ mode, initialSubject }: SubjectFormProps) {
  const form = useForm<SubjectValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: initialSubject?.name ?? "",
      icon: initialSubject?.icon ?? "BookOpen",
      classes: initialSubject?.classes ?? [9, 10],
      isCompulsory: initialSubject?.isCompulsory ?? false,
      displayOrder: initialSubject?.displayOrder ?? 1,
      status: initialSubject?.status ?? "active",
    },
  });
  const values = form.watch();

  function toggleClass(classLevel: ClassLevel) {
    const next = values.classes.includes(classLevel)
      ? values.classes.filter((item) => item !== classLevel)
      : [...values.classes, classLevel];
    form.setValue("classes", next, { shouldValidate: true });
  }

  function onSubmit(data: SubjectValues) {
    console.log(`${mode} subject`, data);
    toast.success(mode === "create" ? "Subject created" : "Subject changes saved");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="grid gap-4 rounded-lg border bg-card p-5 md:grid-cols-2">
        <Field label="Subject name" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </Field>
        <Field label="Display order" error={form.formState.errors.displayOrder?.message}>
          <Input type="number" {...form.register("displayOrder")} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Subject icon">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {iconNames.map((name) => {
                const Icon = iconMap[name];
                return (
                  <Button
                    key={name}
                    type="button"
                    variant={values.icon === name ? "default" : "outline"}
                    className="h-12"
                    onClick={() => form.setValue("icon", name, { shouldValidate: true })}
                  >
                    <Icon className="size-5" />
                  </Button>
                );
              })}
            </div>
          </Field>
        </div>
        <Field label="Classes" error={form.formState.errors.classes?.message}>
          <div className="grid grid-cols-4 gap-2">
            {classLevels.map((classLevel) => (
              <label key={classLevel} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={values.classes.includes(classLevel)}
                  onChange={() => toggleClass(classLevel)}
                  className="size-4 accent-ps-coral"
                />
                {classLevel}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Status">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "active")}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={values.isCompulsory}
              onChange={(event) => form.setValue("isCompulsory", event.target.checked)}
              className="size-4 accent-ps-coral"
            />
            Is compulsory?
          </label>
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="bg-ps-coral hover:bg-ps-coral/90">
          {mode === "create" ? "Create subject" : "Save changes"}
        </Button>
        <Button type="button" variant="ghost">
          <Link href="/subjects">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
