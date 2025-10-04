import SpUser from "../components/layouts/footer/sp-user-footer";
import SpUserHeader from "../components/layouts/header/sp-user-header";
export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SpUserHeader />
      {children}
      <SpUser />
    </div>
  );
}
