"use client";
import ProfileDisplay from "../../features/user/profile-display";
import UserDelete from "@/app/features/user/user-delete";

export default function UserPage() {
  return (
    <div>
      <div className="flex justify-center items-center">
        <ProfileDisplay />
      </div>
      <UserDelete />
    </div>
  );
}
