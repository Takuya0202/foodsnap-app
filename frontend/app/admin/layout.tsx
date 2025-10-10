import PcAdminHeader from "../components/layouts/header/pc-admin-header";
import PcAdminFooter from "../components/layouts/footer/pc-admin-footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PcAdminHeader />
      <main className="flex-1">
        {children}
        </main>
      <PcAdminFooter />
    </div>
  );
}
