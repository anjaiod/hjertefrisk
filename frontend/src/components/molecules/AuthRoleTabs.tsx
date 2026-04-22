import { Button } from "@/components/atoms/Button";
import type { RegisterRole } from "@/types/Auth";

type AuthRoleTabsProps = {
  activeRole: RegisterRole;
  onChange: (role: RegisterRole) => void;
};

export function AuthRoleTabs({ activeRole, onChange }: AuthRoleTabsProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Button
        type="button"
        variant={activeRole === "patient" ? "primary" : "secondary"}
        fullWidth
        onClick={() => onChange("patient")}
      >
        Opprett pasient
      </Button>
      <Button
        type="button"
        variant={activeRole === "personnel" ? "primary" : "secondary"}
        fullWidth
        onClick={() => onChange("personnel")}
      >
        Opprett personell
      </Button>
    </div>
  );
}
