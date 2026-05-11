export type NoteFile = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

export type UserNote = {
  id: string;
  courseCode: string;
  topic: string;
  files: NoteFile[];
  createdAt: string;
  updatedAt: string;
};

export type NoteUploadInput = {
  courseCode: string;
  topic: string;
  files: File[];
};

const STORAGE_PREFIX = "qvault-notes";
const STORAGE_EVENT = "qvault-notes-updated";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getNotesOwnerKey(user: { _id?: string; id?: string; email?: string } | null | undefined) {
  return user?._id || user?.id || user?.email || null;
}

function getStorageKey(ownerKey: string) {
  return `${STORAGE_PREFIX}:${ownerKey}`;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function getNotes(ownerKey: string | null): UserNote[] {
  if (!canUseStorage() || !ownerKey) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(ownerKey));
    return raw ? (JSON.parse(raw) as UserNote[]) : [];
  } catch {
    return [];
  }
}

function saveNotes(ownerKey: string, notes: UserNote[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(getStorageKey(ownerKey), JSON.stringify(notes));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export async function createNote(ownerKey: string | null, input: NoteUploadInput) {
  if (!ownerKey) {
    return null;
  }

  const uploadedAt = new Date().toISOString();
  const files = await Promise.all(
    input.files.map(async (file) => ({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      dataUrl: await readFileAsDataUrl(file),
    })),
  );

  const nextNote: UserNote = {
    id: createId(),
    courseCode: input.courseCode.trim(),
    topic: input.topic.trim(),
    files,
    createdAt: uploadedAt,
    updatedAt: uploadedAt,
  };

  const nextNotes = [nextNote, ...getNotes(ownerKey)];
  saveNotes(ownerKey, nextNotes);
  return nextNote;
}

export function clearNotes(ownerKey: string | null) {
  if (!ownerKey) {
    return;
  }

  saveNotes(ownerKey, []);
}

export function removeNote(ownerKey: string | null, noteId: string) {
  if (!ownerKey) {
    return;
  }

  saveNotes(ownerKey, getNotes(ownerKey).filter((item) => item.id !== noteId));
}

// Listen for storage changes to sync notes across tabs 