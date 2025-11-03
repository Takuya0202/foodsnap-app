"use client";

import { Pagination as MuiPagination } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentOffset: number;
  totalItems: number;
  itemsPerPage: number;
};

export default function Pagination({ currentOffset, totalItems, itemsPerPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = currentOffset + 1;

  // ページ変更時の処理
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("offset", (page - 1).toString());
    router.push(`/stores/index?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center py-4 bg-transparent">
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        disabled={totalPages <= 1} // 1ページのみの場合は無効化
        sx={{
          "& .MuiPaginationItem-root": {
            color: "white",
            borderColor: "rgba(255, 255, 255, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          },
          "& .Mui-selected": {
            backgroundColor: "#3b82f6 !important",
            color: "white",
            "&:hover": {
              backgroundColor: "#2563eb !important",
            },
          },
          "& .MuiPaginationItem-icon": {
            color: "white",
          },
          "& .Mui-disabled": {
            color: "rgba(255, 255, 255, 0.3)",
          },
        }}
      />
    </div>
  );
}
