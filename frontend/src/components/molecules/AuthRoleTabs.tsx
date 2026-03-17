import { Button } from "@/components/atoms/Button";
import type { RegisterRole } from "@/types/Auth";

type AuthRoleTabsProps = {
  activeRole: RegisterRole;
  onChange: (role: RegisterRole) => void;
};

export function AuthRoleTabs({ activeRole, onChange }: AuthRoleTabsProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
      <Button
        type="button"
        variant="secondary"
        className={
          activeRole === "patient"
            ? "border-0 bg-white px-3 py-2 text-sm text-brand-navy shadow-sm"
            : "border-0 bg-transparent px-3 py-2 text-sm text-slate-600 hover:bg-slate-200"
        }
        fullWidth
        onClick={() => onChange("patient")}
      >
        Opprett pasient
      </Button>
      <Button
        type="button"
        variant="secondary"
        className={
          activeRole === "personnel"
            ? "border-0 bg-white px-3 py-2 text-sm text-brand-navy shadow-sm"
            : "border-0 bg-transparent px-3 py-2 text-sm text-slate-600 hover:bg-slate-200"
        }
        fullWidth
        onClick={() => onChange("personnel")}
      >
        Opprett personell
      </Button>
    </div>
  );
}
