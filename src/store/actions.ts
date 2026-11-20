import type { AppData, PromptSnapshot, Revision, TargetType, UploadedFile } from '../types';

export const CURRENT_USER = 'Raka Pradipta (System Implementor)';

function nextRevisionNumber(data: AppData, targetType: TargetType, targetId: string): number {
  const numbers = data.revisions.filter((r) => r.targetType === targetType && r.targetId === targetId).map((r) => r.number);
  return numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
}

function revisionId(targetType: TargetType, targetId: string, number: number): string {
  return `rev-${targetType}-${targetId}-${number}`;
}

/** Ganti file versi dan tambah tepat satu revisi "Diunggah" (atau jenis lain untuk pengembalian). */
export function uploadVersionFile(data: AppData, versionId: string, file: UploadedFile, now: string, action = 'Diunggah'): AppData {
  const version = data.versions.find((v) => v.id === versionId);
  if (!version) throw new Error(`Versi ${versionId} tidak ditemukan`);
  const number = nextRevisionNumber(data, 'version', versionId);
  const revision: Revision = {
    id: revisionId('version', versionId, number),
    targetType: 'version',
    targetId: versionId,
    number,
    action,
    createdAt: now,
    createdBy: CURRENT_USER,
    snapshot: { ...file },
  };
  return {
    ...data,
    versions: data.versions.map((v) => (v.id === versionId ? { ...v, ...file, updatedAt: now, updatedBy: CURRENT_USER } : v)),
    revisions: [...data.revisions, revision],
  };
}

/** Simpan prompt. Mengembalikan null bila nama (sesudah trim) dan isi sama dengan yang tersimpan. */
export function savePrompt(data: AppData, promptId: string, input: PromptSnapshot, now: string, action = 'Disimpan'): AppData | null {
  const prompt = data.prompts.find((p) => p.id === promptId);
  if (!prompt) throw new Error(`Prompt ${promptId} tidak ditemukan`);
  const name = input.name.trim();
  if (name === prompt.name && input.content === prompt.content) return null;
  const number = nextRevisionNumber(data, 'prompt', promptId);
  const revision: Revision = {
    id: revisionId('prompt', promptId, number),
    targetType: 'prompt',
    targetId: promptId,
    number,
    action,
    createdAt: now,
    createdBy: CURRENT_USER,
    snapshot: { name, content: input.content },
  };
  return {
    ...data,
    prompts: data.prompts.map((p) => (p.id === promptId ? { ...p, name, content: input.content, updatedAt: now, updatedBy: CURRENT_USER } : p)),
    revisions: [...data.revisions, revision],
  };
}

/** Kembalikan isi objek ke revisi tertentu sebagai revisi baru. Revisi lama tidak disentuh. */
export function restoreRevision(data: AppData, revisionIdToRestore: string, now: string): { data: AppData; newNumber: number } {
  const revision = data.revisions.find((r) => r.id === revisionIdToRestore);
  if (!revision) throw new Error(`Revisi ${revisionIdToRestore} tidak ditemukan`);
  const action = `Dikembalikan dari revisi #${revision.number}`;
  const newNumber = nextRevisionNumber(data, revision.targetType, revision.targetId);
  if (revision.targetType === 'prompt') {
    const next = savePrompt(data, revision.targetId, revision.snapshot, now, action);
    if (!next) throw new Error('Isi revisi sama dengan isi saat ini');
    return { data: next, newNumber };
  }
  return { data: uploadVersionFile(data, revision.targetId, revision.snapshot, now, action), newNumber };
}
