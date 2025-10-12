import PcAdminFooter from "../components/layouts/footer/pc-admin-footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <PcAdminFooter />
    </div>
  );
}
