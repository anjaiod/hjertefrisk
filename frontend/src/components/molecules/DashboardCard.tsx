import { Button } from "../atoms/Button";

type DashboardCardProps = {
  text: string;
  onClick?: () => void;
};

export function DashboardCard({ text, onClick }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <Button onClick={onClick} variant="confirm" className="w-full">
        {text}
      </Button>
    </div>
  );
}
