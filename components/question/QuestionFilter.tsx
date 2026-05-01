"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuestionFilter({ filters, setFilters }: any) {
  return (
    <div className="flex flex-wrap gap-4 bg-muted p-4 rounded-xl">
      {/* Department */}
      <Select
        onValueChange={(v) => setFilters((p: any) => ({ ...p, dept: v }))}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cse">CSE</SelectItem>
          <SelectItem value="eee">EEE</SelectItem>
          <SelectItem value="me">ME</SelectItem>
        </SelectContent>
      </Select>

      {/* Level */}
      <Select
        onValueChange={(v) => setFilters((p: any) => ({ ...p, level: v }))}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Level 1</SelectItem>
          <SelectItem value="2">Level 2</SelectItem>
          <SelectItem value="3">Level 3</SelectItem>
          <SelectItem value="4">Level 4</SelectItem>
        </SelectContent>
      </Select>

      {/* Type */}
      <Select
        onValueChange={(v) => setFilters((p: any) => ({ ...p, type: v }))}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ct1">CT 1</SelectItem>
          <SelectItem value="ct2">CT 2</SelectItem>
          <SelectItem value="ct3">CT 3</SelectItem>
          <SelectItem value="mid">Mid</SelectItem>
          <SelectItem value="final">Final</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
