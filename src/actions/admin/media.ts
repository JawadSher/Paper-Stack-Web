"use server";

import type { AdminAuditLog, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import type {
  ActionResult,
  AuditFilters,
  PaginatedResponse,
} from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";
import { actionError, requireAdmin, writeAudit } from "./_helpers";

type StorageFile = {
  name: string;
  id?: string | null;
  size?: number;
  metadata?: Record<string, unknown> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastAccessedAt?: string | null;
};

export async function getStorageFiles(
  prefix?: string,
): Promise<ActionResult<StorageFile[]>> {
  try {
    await requireAdmin();
    const { data, error } = await supabaseAdmin.storage
      .from("papers")
      .list(prefix, { limit: 100 });

    if (error) return fail(error.message);

    return ok(
      (data ?? []).map((file) => ({
        name: file.name,
        id: file.id,
        size: file.metadata?.size,
        metadata: file.metadata,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        lastAccessedAt: file.last_accessed_at,
      })),
    );
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function deleteStorageFile(
  path: string,
): Promise<ActionResult<void>> {
  try {
    const adminUserId = await requireAdmin();
    const { error } = await supabaseAdmin.storage.from("papers").remove([path]);
    if (error) return fail(error.message);

    const referencedPapers = await prisma.paper.findMany({
      where: { storagePath: path },
    });
    if (referencedPapers.length > 0) {
      await prisma.paper.updateMany({
        where: { storagePath: path },
        data: {
          storagePath: null,
          pdfUrl: null,
          fileSizeBytes: null,
          status: "DRAFT",
          publishedAt: null,
        },
      });
    }

    await writeAudit({
      adminUserId,
      action: "delete",
      entityType: "media",
      entityId: referencedPapers[0]?.id,
      oldValue: { path, referencedPapers },
    });
    revalidatePath("/(admin)/media");
    revalidatePath("/(admin)/papers");
    revalidatePath("/browse");

    return ok(undefined);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function getAuditLog(
  filters: AuditFilters = {},
): Promise<ActionResult<PaginatedResponse<AdminAuditLog>>> {
  try {
    await requireAdmin();
    const { page = 1, pageSize = 20, entityType, adminUserId, action } = filters;
    const where: Prisma.AdminAuditLogWhereInput = {
      ...(entityType && { entityType }),
      ...(adminUserId && { adminUserId }),
      ...(action && { action }),
    };

    const [data, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.adminAuditLog.count({ where }),
    ]);

    return ok({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    return fail(await actionError(e));
  }
}
