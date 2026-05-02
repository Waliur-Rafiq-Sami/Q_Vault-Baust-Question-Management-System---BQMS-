"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import {
  hasBookmark,
  upsertBookmark,
  getBookmarkOwnerKey,
  type BookmarkQuestion,
  type BookmarkSolve,
} from "@/lib/bookmarks";

type BookmarkButtonProps = {
  question: BookmarkQuestion;
  solve?: BookmarkSolve;
  className?: string;
};

export default function BookmarkButton({ question, solve, className }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const ownerKey = getBookmarkOwnerKey(user);

  useEffect(() => {
    setBookmarked(hasBookmark(ownerKey, question._id, solve?.url));
  }, [ownerKey, question._id, solve?.url]);

  const handleBookmark = () => {
    if (!ownerKey) {
      toast.error("Please log in to save bookmarks");
      router.push("/auth");
      return;
    }

    upsertBookmark(ownerKey, question, solve);
    setBookmarked(true);
    toast.success("Added to bookmarks");
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      className={`inline-flex items-center justify-center h-11 w-11 rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-md transition hover:scale-105 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 ${className ?? ""}`}
      aria-label="Bookmark tile"
      title="Bookmark"
    >
      {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
    </button>
  );
}