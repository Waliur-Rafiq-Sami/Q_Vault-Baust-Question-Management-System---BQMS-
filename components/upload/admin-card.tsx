// components/upload/admin-card.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ShieldCheck } from "lucide-react";

export function AdminCard({ user }: { user: any }) {
  return (
    <div className="w-full bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
      {/* Left: Identity Section */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-slate-50 ring-4 ring-slate-100/50 shadow-sm">
            <AvatarImage src={user.image} className="object-cover" />
            <AvatarFallback className="bg-slate-900 text-white font-bold text-xl">
              {user.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-0 -right-0 bg-emerald-500 h-5 w-5 rounded-full border-4 border-white shadow-sm" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {user.name}
            </h2>
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-0.5 rounded-full uppercase font-black text-[10px] tracking-widest hover:bg-emerald-100 transition-colors">
              <ShieldCheck className="w-3 h-3 mr-1" />
              {user.role}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium text-sm">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-emerald-500" />
              {user.email}
            </div>
            <div className="hidden md:block h-3 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-500" />
              {user.phone || "+880 1XXX-XXXXXX"}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Quick Stats (Optional slim version) */}
      <div className="hidden lg:flex items-center gap-8 pr-4">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Status
          </p>
          <p className="text-sm font-bold text-emerald-600">Verified Admin</p>
        </div>
      </div>
    </div>
  );
}
