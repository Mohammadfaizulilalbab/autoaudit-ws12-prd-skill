export interface Client {
  id: string;
  name: string;
}

export interface SavedPrompt {
  id: string;
  clientId: string;
  name: string;
  content: string;
  updatedAt: string;
  updatedBy: string;
}

export type AuditStatus = 'Aktif' | 'Nonaktif';

export interface ContinuousAudit {
  id: string;
  clientId: string;
  name: string;
  schedule: string;
  status: AuditStatus;
  promptId: string;
}

export interface CrmPage {
  id: string;
  clientId: string;
  name: string;
}

export type VersionStatus = 'Draft' | 'Published' | 'Archived';

export interface DashboardVersion {
  id: string;
  pageId: string;
  number: number;
  status: VersionStatus;
  fileName: string;
  fileSize: number;
  fileContent: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PromptSnapshot {
  name: string;
  content: string;
}

export interface VersionSnapshot {
  fileName: string;
  fileSize: number;
  fileContent: string;
}

interface RevisionBase {
  id: string;
  targetId: string;
  number: number;
  action: string;
  createdAt: string;
  createdBy: string;
}

export interface PromptRevision extends RevisionBase {
  targetType: 'prompt';
  snapshot: PromptSnapshot;
}

export interface VersionRevision extends RevisionBase {
  targetType: 'version';
  snapshot: VersionSnapshot;
}

export type Revision = PromptRevision | VersionRevision;

export type TargetType = Revision['targetType'];

export interface AppData {
  schemaVersion: 1;
  selectedClientId: string;
  clients: Client[];
  prompts: SavedPrompt[];
  audits: ContinuousAudit[];
  pages: CrmPage[];
  versions: DashboardVersion[];
  revisions: Revision[];
}

export interface UploadedFile {
  fileName: string;
  fileSize: number;
  fileContent: string;
}
