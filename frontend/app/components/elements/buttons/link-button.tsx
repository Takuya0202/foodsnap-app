import Link from "next/link";
import React from "react";

type props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  richMode?: boolean;
};
// 共通Linkタグ。
export default function LinkButton({ href, children, className, icon, richMode = false }: props) {
  const style = richMode
    ? "flex items-center space-x-3 p-3 rounded-lg hover:bg-[#262626] transition-colors"
    : "flex items-center space-x-3 text-[#3d91ff]";
  return (
    <Link href={href} className={`${style} ${className}`}>
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
