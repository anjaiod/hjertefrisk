import { SidebarNav } from "../../components/organisms/SidebarNav";

export default function DashboardPage() {
  return (
    <div className="flex">
      <SidebarNav activePath="/dashboard"/>
    </div>
  );
}
