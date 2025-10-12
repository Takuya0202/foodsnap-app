import Accessibility from "@/app/components/elements/others/accessibility";
import { PcAdminHeaderSkeleton , PcAdminHeader} from "@/app/components/layouts/header/pc-admin-header";
import { serverClient } from "@/utils/serverClient";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminDashboard() {
  const fetchData = async () => {
    const client = await serverClient();
    const res = await client.api.admin.dashboard.$get();
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
    else {
      const data = await res.json();
      console.log(data.error);
      return redirect("/auth/admin/login");
    }
  }

  const data = await fetchData();
  return (
    <>
      <Suspense fallback={<PcAdminHeaderSkeleton />}>
        <PcAdminHeader name={data.name} />
      </Suspense>
      <div className="flex flex-col h-full w-full px-20">
        {/* いいね、コメント数のコンポーネント */}
        <div className="flex items-center space-x-8">
          <Accessibility count={data.likeCount} label="like" loading={false} />
          <Accessibility count={data.commentCount} label="comment" loading={false} />
        </div>
      </div>
    </>
  );
}
