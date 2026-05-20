import { supabaseAdmin } from './supabase'

const BUCKET = 'papers'

export function getPaperStoragePath({
  province,
  boardShortName,
  classLevel,
  subjectName,
  year,
  session,
}: {
  province: string
  boardShortName: string
  classLevel: number
  subjectName: string
  year: number
  session: string
}): string {
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  return [
    slug(province),
    slug(boardShortName),
    classLevel.toString(),
    slug(subjectName),
    year.toString(),
    `${session}.pdf`,
  ].join('/')
}

export async function uploadPaper(
  file: File,
  storagePath: string
): Promise<string> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

export async function deletePaper(storagePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .remove([storagePath])

  if (error) throw new Error(`Delete failed: ${error.message}`)
}

export async function getSignedUrl(
  storagePath: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds)

  if (error) throw new Error(`Signed URL failed: ${error.message}`)
  return data.signedUrl
}
