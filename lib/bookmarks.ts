export type BookmarkQuestion = {
  _id: string;
  department?: string;
  dept?: string;
  batch?: string;
  courseCode?: string;
  courseTitle?: string;
  level?: string;
  term?: string;
  type?: string;
  questions?: string[];
  solutions?: string[];
};

export type BookmarkSolve = {
  url: string;
  label: string;
};

export type BookmarkGroup = {
  questionId: string;
  question: BookmarkQuestion;
  solves: BookmarkSolve[];
  updatedAt: string;
};

export function getBookmarkOwnerKey(user: { _id?: string; id?: string; email?: string } | null | undefined) {
  return user?._id || user?.id || user?.email || null;
}

function normalizeQuestion(question: BookmarkQuestion): BookmarkQuestion {
  return {
    ...question,
    questions: question.questions ?? [],
    solutions: question.solutions ?? [],
  };
}

function normalizeSolve(url: string, label: string): BookmarkSolve {
  return { url, label };
}

function dispatchBookmarksUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("qvault-bookmarks-updated"));
  }
}

export async function getBookmarks(ownerKey: string | null): Promise<BookmarkGroup[]> {
  if (!ownerKey) {
    return [];
  }

  try {
    const response = await fetch(`/api/bookmarks?ownerKey=${encodeURIComponent(ownerKey)}`);
    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { bookmarks?: BookmarkGroup[] };
    return data.bookmarks ?? [];
  } catch {
    return [];
  }
}

export async function upsertBookmark(ownerKey: string | null, question: BookmarkQuestion, solve?: BookmarkSolve) {
  if (!ownerKey) {
    return null;
  }

  const normalizedQuestion = normalizeQuestion(question);
  const response = await fetch("/api/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ownerKey,
      question: normalizedQuestion,
      solve: solve ?? undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to save bookmark");
  }

  dispatchBookmarksUpdated();

  const data = (await response.json()) as { bookmark?: BookmarkGroup };
  return data.bookmark ?? null;
}

export async function removeBookmark(ownerKey: string | null, questionId: string) {
  if (!ownerKey) {
    return;
  }

  const response = await fetch("/api/bookmarks", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerKey, questionId }),
  });

  if (!response.ok) {
    throw new Error("Unable to remove bookmark");
  }

  dispatchBookmarksUpdated();
}

export async function clearBookmarks(ownerKey: string | null) {
  if (!ownerKey) {
    return;
  }

  const response = await fetch("/api/bookmarks", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerKey, clearAll: true }),
  });

  if (!response.ok) {
    throw new Error("Unable to clear bookmarks");
  }

  dispatchBookmarksUpdated();
}

export async function hasBookmark(ownerKey: string | null, questionId: string, solveUrl?: string) {
  const group = (await getBookmarks(ownerKey)).find((item) => item.questionId === questionId);

  if (!group) {
    return false;
  }

  if (!solveUrl) {
    return true;
  }

  return group.solves.some((solve) => solve.url === solveUrl);
}