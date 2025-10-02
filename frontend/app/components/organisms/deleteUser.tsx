"use client";
import { useState } from "react";
import UserDeleteButton from "../atoms/buttons/userDelete-button";
import ConfirmDelete from "../molecules/modal/confirm-delete";

export default function DeleteUser() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <UserDeleteButton setIsOpen={setIsOpen} />
      {isOpen && <ConfirmDelete setIsOpen={setIsOpen} />}
    </>
  );
}
