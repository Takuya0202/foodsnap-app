import PcAdminHeader from "../components/layouts/header/pc-admin-header";
import PcAdminFooter from "../components/layouts/footer/pc-admin-footer";
import Accessibility from "../components/elements/others/accessibility";
import { Suspense } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PcAdminHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex flex-col h-full w-full px-20">
              <div className="flex items-center space-x-8">
                <Accessibility loading={true} />
                <Accessibility loading={true} />
              </div>
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
      <PcAdminFooter />
    </div>
  );
}
