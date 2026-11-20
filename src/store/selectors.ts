import type { AppData, ContinuousAudit, Revision, TargetType } from '../types';

export function auditsForPrompt(data: AppData, promptId: string): ContinuousAudit[] {
  return data.audits.filter((a) => a.promptId === promptId).sort((a, b) => a.name.localeCompare(b.name, 'id'));
}

/** Revisi satu objek, terbaru di atas. */
export function revisionsFor(data: AppData, targetType: TargetType, targetId: string): Revision[] {
  return data.revisions
    .filter((r) => r.targetType === targetType && r.targetId === targetId)
    .sort((a, b) => b.number - a.number);
}

/** Revisi sama dengan isi saat ini bila semua bagian yang akan dikembalikan sama (D-4). */
export function isSameAsCurrent(data: AppData, revision: Revision): boolean {
  if (revision.targetType === 'prompt') {
    const prompt = data.prompts.find((p) => p.id === revision.targetId);
    return !!prompt && prompt.name === revision.snapshot.name && prompt.content === revision.snapshot.content;
  }
  const version = data.versions.find((v) => v.id === revision.targetId);
  return !!version && version.fileName === revision.snapshot.fileName && version.fileContent === revision.snapshot.fileContent;
}

export function versionsOfPage(data: AppData, pageId: string) {
  return data.versions.filter((v) => v.pageId === pageId).sort((a, b) => b.number - a.number);
}

export function clientName(data: AppData, clientId: string): string {
  return data.clients.find((c) => c.id === clientId)?.name ?? clientId;
}
