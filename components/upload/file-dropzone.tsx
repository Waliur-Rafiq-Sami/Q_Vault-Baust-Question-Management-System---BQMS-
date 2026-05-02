// components/upload/file-dropzone.tsx
import { Label } from "@/components/ui/label";
import { LucideIcon, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Import Sonner

interface DropzoneProps {
  label: string;
  description?: string;
  icon: LucideIcon;
  accept: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  preview?: boolean;
  multiple?: boolean;
  optional?: boolean;
  required?: boolean; // New prop
  colorScheme?: "primary" | "cyan";
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileDropzone({
  label,
  description,
  icon: Icon,
  accept,
  files,
  onFilesChange,
  preview,
  multiple,
  optional,
  required,
  colorScheme = "primary",
}: DropzoneProps) {
  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(e.target.files || []);

    // Filter out files that cross 10MB
    const validFiles = incomingFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" is too heavy!`, {
          description: "Max limit is 10MB. Please compress it.",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (multiple) {
      onFilesChange([...files, ...validFiles]);
      toast.success(`Added ${validFiles.length} file(s)`);
    } else {
      onFilesChange(validFiles);
    }
  };

  const removeFile = (index: number) => {
    const fileName = files[index].name;
    onFilesChange(files.filter((_, i) => i !== index));
    toast.info(`Removed ${fileName}`);
  };

  const styles =
    colorScheme === "primary"
      ? "border-emerald-100 bg-emerald-50/30 hover:border-emerald-400"
      : "border-cyan-100 bg-cyan-50/30 hover:border-cyan-400";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between ml-1">
        <div className="flex flex-col">
          <Label className="font-black text-slate-800 uppercase text-[11px] tracking-wider flex items-center gap-2">
            {label}
            {optional && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 lowercase border border-slate-200">
                optional
              </span>
            )}
            {required && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-500 lowercase border border-red-200">
                required
              </span>
            )}
          </Label>
          {description && (
            <span className="text-[10px] text-slate-500 font-medium">
              {description}
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          multiple
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1",
        )}
      >
        {files.map((file, idx) => (
          <div
            key={idx}
            className="relative group aspect-[1/1.4] rounded-2xl border-2 border-slate-200 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md"
          >
            {preview && file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                className="h-full w-full object-cover"
                alt="preview"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-slate-50/50 text-center">
                <FileIcon
                  className={cn(
                    "w-6 h-6 mb-2",
                    colorScheme === "cyan"
                      ? "text-cyan-600"
                      : "text-emerald-600",
                  )}
                />
                <p className="text-[9px] text-slate-500 font-bold uppercase">
                  {file.name.split(".").pop()}
                </p>
              </div>
            )}
            <button
              onClick={() => removeFile(idx)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <div
          className={cn(
            "relative aspect-[1/1.4] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all cursor-pointer group",
            styles,
          )}
        >
          <Icon
            className={cn(
              "w-8 h-8 mb-2 group-hover:scale-110 transition-transform",
              colorScheme === "primary" ? "text-emerald-400" : "text-cyan-400",
            )}
          />
          <span className="text-[10px] font-black uppercase text-slate-500">
            Add {files.length > 0 ? "Page" : "File"}
          </span>
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileAdd}
          />
        </div>
      </div>
    </div>
  );
}
