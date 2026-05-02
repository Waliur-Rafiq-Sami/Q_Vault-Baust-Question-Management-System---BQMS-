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

const STORAGE_PREFIX = "qvault-bookmarks";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getBookmarkOwnerKey(user: { _id?: string; id?: string; email?: string } | null | undefined) {
  return user?._id || user?.id || user?.email || null;
}

function getStorageKey(ownerKey: string) {
  return `${STORAGE_PREFIX}:${ownerKey}`;
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

function uniqueSolves(solves: BookmarkSolve[]) {
  return solves.filter(
    (solve, index, list) => list.findIndex((item) => item.url === solve.url) === index,
  );
}

export function getBookmarks(ownerKey: string | null): BookmarkGroup[] {
  if (!canUseStorage()) {
    return [];
  }

  if (!ownerKey) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(ownerKey));
    return raw ? (JSON.parse(raw) as BookmarkGroup[]) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(ownerKey: string, bookmarks: BookmarkGroup[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(getStorageKey(ownerKey), JSON.stringify(bookmarks));
  window.dispatchEvent(new Event("qvault-bookmarks-updated"));
}

export function upsertBookmark(ownerKey: string | null, question: BookmarkQuestion, solve?: BookmarkSolve) {
  if (!ownerKey) {
    return null;
  }

  const normalizedQuestion = normalizeQuestion(question);
  const bookmarks = getBookmarks(ownerKey);
  const questionId = normalizedQuestion._id;
  const existingIndex = bookmarks.findIndex((item) => item.questionId === questionId);

  const fallbackSolves =
    normalizedQuestion.solutions?.map((url, index) => normalizeSolve(url, `Sol-${index + 1}`)) ?? [];
  const incomingSolves = solve ? [solve] : fallbackSolves;

  if (existingIndex === -1) {
    const nextGroup: BookmarkGroup = {
      questionId,
      question: normalizedQuestion,
      solves: uniqueSolves(incomingSolves),
      updatedAt: new Date().toISOString(),
    };

    saveBookmarks(ownerKey, [nextGroup, ...bookmarks]);
    return nextGroup;
  }

  const existingGroup = bookmarks[existingIndex];
  const mergedGroup: BookmarkGroup = {
    ...existingGroup,
    question: normalizedQuestion,
    solves: uniqueSolves([...existingGroup.solves, ...incomingSolves]),
    updatedAt: new Date().toISOString(),
  };

  const nextBookmarks = [...bookmarks];
  nextBookmarks[existingIndex] = mergedGroup;
  saveBookmarks(ownerKey, nextBookmarks);
  return mergedGroup;
}

export function removeBookmark(ownerKey: string | null, questionId: string) {
  if (!ownerKey) {
    return;
  }

  const nextBookmarks = getBookmarks(ownerKey).filter((item) => item.questionId !== questionId);
  saveBookmarks(ownerKey, nextBookmarks);
}

export function clearBookmarks(ownerKey: string | null) {
  if (!ownerKey) {
    return;
  }

  saveBookmarks(ownerKey, []);
}

export function hasBookmark(ownerKey: string | null, questionId: string, solveUrl?: string) {
  const group = getBookmarks(ownerKey).find((item) => item.questionId === questionId);

  if (!group) {
    return false;
  }

  if (!solveUrl) {
    return true;
  }

  return group.solves.some((solve) => solve.url === solveUrl);
}