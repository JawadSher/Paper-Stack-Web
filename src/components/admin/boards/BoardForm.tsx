"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateBoard } from "@/hooks/admin/mutations/useCreateBoard";
import { useDeleteBoard } from "@/hooks/admin/mutations/useDeleteBoard";
import { useUpdateBoard } from "@/hooks/admin/mutations/useUpdateBoard";
import type { ClassLevel } from "@/types";
import type { AdminBoard, BoardStatus } from "./types";

const provinces = [
  "Federal",
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "AJK",
  "Gilgit-Baltistan",
] as const;

const colorPresets = [
  "#3B82F6",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#EF4444",
  "#6366F1",
  "#10B981",
  "#B65E3C",
  "#D97757",
];
const classLevels: ClassLevel[] = [9, 10, 11, 12];

const boardSchema = z.object({
  name: z.string().min(5).max(100),
  shortName: z.string().min(3).max(25),
  province: z.enum(provinces),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(200),
  classes: z
    .array(z.union([z.literal(9), z.literal(10), z.literal(11), z.literal(12)]))
    .min(1),
  color: z.string().min(1),
  status: z.enum(["active", "inactive"]),
});

type BoardValues = z.infer<typeof boardSchema>;

export type BoardFormProps = {
  mode: "create" | "edit";
  initialBoard?: AdminBoard;
  paperCount?: number;
};

export function BoardForm({
  mode,
  initialBoard,
  paperCount = 0,
}: BoardFormProps) {
  const router = useRouter();
  const createBoard = useCreateBoard();
  const updateBoard = useUpdateBoard();
  const deleteBoard = useDeleteBoard();
  const form = useForm<BoardValues>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: initialBoard?.name ?? "",
      shortName: initialBoard?.shortName ?? "",
      province: initialBoard?.province ?? "Punjab",
      websiteUrl: initialBoard?.websiteUrl ?? "",
      description: initialBoard?.description ?? "",
      classes: initialBoard?.classes ?? [9, 10, 11, 12],
      color: initialBoard?.color ?? colorPresets[0],
      status: initialBoard?.status ?? "active",
    },
  });

  const values = form.watch();
  const isPending =
    createBoard.isPending || updateBoard.isPending || deleteBoard.isPending;

  useEffect(() => {
    if (!initialBoard) return;
    form.reset({
      name: initialBoard.name,
      shortName: initialBoard.shortName,
      province: initialBoard.province,
      websiteUrl: initialBoard.websiteUrl ?? "",
      description: initialBoard.description ?? "",
      classes: initialBoard.classes,
      color: initialBoard.color,
      status: initialBoard.status,
    });
  }, [form, initialBoard]);

  function toggleClass(classLevel: ClassLevel) {
    const next = values.classes.includes(classLevel)
      ? values.classes.filter((item) => item !== classLevel)
      : [...values.classes, classLevel];
    form.setValue("classes", next, { shouldValidate: true });
  }

  async function onSubmit(data: BoardValues) {
    const province =
      data.province === "Gilgit-Baltistan" ? "Gilgit_Baltistan" : data.province;
    const payload = {
      name: data.name,
      shortName: data.shortName,
      province,
      description: data.description,
      websiteUrl: data.websiteUrl || undefined,
      color: data.color,
      displayOrder: 0,
    };

    if (mode === "create") {
      const result = await createBoard.mutateAsync(payload);
      if (result.success) router.push("/boards");
      return;
    }

    if (!initialBoard) return;
    const result = await updateBoard.mutateAsync({
      id: initialBoard.id,
      data: {
        ...payload,
        isActive: data.status === "active",
      },
    });
    if (result.success) router.push("/boards");
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-3xl space-y-6"
    >
      <div className="grid gap-4 rounded-lg border bg-card p-5 md:grid-cols-2">
        <Field label="Board name" error={form.formState.errors.name?.message}>
          <Input
            {...form.register("name")}
            placeholder="Board of Intermediate and Secondary Education, Lahore"
          />
        </Field>
        <Field
          label={`Short name (${values.shortName.length}/25)`}
          error={form.formState.errors.shortName?.message}
        >
          <Input
            {...form.register("shortName")}
            maxLength={25}
            placeholder="BISE Lahore"
          />
        </Field>
        <Field label="Province">
          <Controller
            control={form.control}
            name="province"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? "Punjab")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field
          label="Website URL"
          error={form.formState.errors.websiteUrl?.message}
        >
          <Input
            {...form.register("websiteUrl")}
            placeholder="https://example.edu.pk"
          />
        </Field>
        <div className="md:col-span-2">
          <Field
            label={`Description (${values.description.length}/200)`}
            error={form.formState.errors.description?.message}
          >
            <Textarea {...form.register("description")} maxLength={200} />
          </Field>
        </div>
        <Field
          label="Classes supported"
          error={form.formState.errors.classes?.message}
        >
          <div className="grid grid-cols-4 gap-2">
            {classLevels.map((classLevel) => (
              <Button
                key={classLevel}
                type="button"
                variant={
                  values.classes.includes(classLevel) ? "default" : "outline"
                }
                onClick={() => toggleClass(classLevel)}
              >
                {classLevel}
              </Button>
            ))}
          </div>
        </Field>
        <Field label="Status">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) =>
                  field.onChange((value ?? "active") as BoardStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Accent color">
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Use ${color}`}
                className="size-8 rounded-full ring-2 ring-transparent data-[selected=true]:ring-foreground"
                data-selected={values.color === color}
                style={{ backgroundColor: color }}
                onClick={() =>
                  form.setValue("color", color, { shouldValidate: true })
                }
              />
            ))}
          </div>
        </Field>
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="bg-ps-coral hover:bg-ps-coral/90">
          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Create board"
              : "Save changes"}
        </Button>
        <Button type="button" variant="ghost">
          <Link href="/boards">Cancel</Link>
        </Button>
      </div>
      {mode === "edit" ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
          <h2 className="font-semibold text-destructive">Danger zone</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Delete this board permanently.
          </p>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button type="button" variant="destructive" className="mt-4">
                  <Trash2 className="size-4" />
                  Delete board
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete board?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting this board will also delete all {paperCount} papers
                  associated with it. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={async () => {
                    if (!initialBoard) return;
                    const result = await deleteBoard.mutateAsync({
                      id: initialBoard.id,
                    });
                    if (result.success) router.push("/boards");
                  }}
                >
                  Delete board
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : null}
    </form>
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
