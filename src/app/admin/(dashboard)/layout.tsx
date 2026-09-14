import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-char-950 font-body text-cream">
      <AdminSidebar adminName={session.name} />
      <div className="flex-1 lg:pl-64">
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
