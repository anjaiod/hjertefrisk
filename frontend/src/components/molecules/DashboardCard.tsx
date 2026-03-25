import { Button } from "../atoms/Button";

type DashboardCardProps = {
  text: string;
  onClick?: () => void;
  className?: string;
};

export function DashboardCard({
  text,
  onClick,
  className,
}: DashboardCardProps) {
  return (
    <Button
      onClick={onClick}
      variant="confirm"
      className={`w-full h-full rounded-2xl text-lg ${className ?? ""}`}
    >
      {text}
    </Button>
  );
}
