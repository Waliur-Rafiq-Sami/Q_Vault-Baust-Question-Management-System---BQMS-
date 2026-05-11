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
  description?: string;
  files: NoteFile[];
  createdAt: string;
  updatedAt: string;
};

export type NoteUploadInput = {
  courseCode: string;
  topic: string;
  description?: string;
  files: File[];
};

type ApiNote = Omit<UserNote, "id"> & {
  _id?: string;
  id?: string;
};

function normalizeNote(note: ApiNote): UserNote {
  return {
    id: note.id || note._id || "",
    courseCode: note.courseCode,
    topic: note.topic,
    description: note.description,
    files: note.files,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

export function getNotesOwnerKey(user: { _id?: string; id?: string; email?: string } | null | undefined) {
  return user?._id || user?.id || user?.email || null;
}

function dispatchNotesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("qvault-notes-updated"));
  }
}

export async function getNotes(ownerKey: string | null): Promise<UserNote[]> {
  if (!ownerKey) {
    return [];
  }

  try {
    const response = await fetch(`/api/notes?ownerKey=${encodeURIComponent(ownerKey)}`);
    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { notes?: ApiNote[] };
    return (data.notes ?? []).map(normalizeNote);
  } catch {
    return [];
  }
}

export async function createNote(ownerKey: string | null, input: NoteUploadInput) {
  if (!ownerKey) {
    return null;
  }

  const formData = new FormData();
  formData.append("ownerKey", ownerKey);
  formData.append("courseCode", input.courseCode.trim());
  formData.append("topic", input.topic.trim());
  formData.append("description", input.description?.trim() || "");

  for (const file of input.files) {
    formData.append("files", file);
  }

  const response = await fetch("/api/notes", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Unable to save note");
  }

  dispatchNotesUpdated();

  const data = (await response.json()) as { note?: ApiNote };
  return data.note ? normalizeNote(data.note) : null;
}

export async function clearNotes(ownerKey: string | null) {
  if (!ownerKey) {
    return;
  }

  const response = await fetch("/api/notes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerKey, clearAll: true }),
  });

  if (!response.ok) {
    throw new Error("Unable to clear notes");
  }

  dispatchNotesUpdated();
}

export async function removeNote(ownerKey: string | null, noteId: string) {
  if (!ownerKey) {
    return;
  }

  const response = await fetch("/api/notes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerKey, noteId }),
  });

  if (!response.ok) {
    throw new Error("Unable to remove note");
  }

  dispatchNotesUpdated();
}

// Listen for storage changes to sync notes across tabs 