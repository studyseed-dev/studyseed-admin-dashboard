"use client";

import { ZodUserSchema } from "@/lib/adminSchema";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";

import Loading from "../components/loading";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DashboardAPIPath } from "@/enums/apiPaths.enum";

type Data = {
  users: ZodUserSchema[];
  totalUsers: number;
  pageNumber: number;
  limitNumber: number;
};

const UserTable = dynamic(() => import("@/components/UserTable"), {
  loading: () => <Loading />,
  ssr: false,
});

const getAllUsers = async (queryKey: [string, string, number]) => {
  const page = queryKey[2];
  const searchTerm = queryKey[1];
  const response = await fetch(
    `${DashboardAPIPath.GET_PAGINATED_USERS}?searchTerm=${searchTerm}&page=${page}`,
  );
  if (response.ok) {
    const resObj = await response.json();
    const { data } = resObj;
    return data;
  }
};

export default function UserOverview() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useQuery<Data>({
    queryKey: ["all-users", searchTerm, currentPage],
    queryFn: () => getAllUsers(["all-users", searchTerm, currentPage]),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.limitNumber ? Math.ceil(data.totalUsers / data.limitNumber) : 0;
  const pageArray = !!totalPages && new Array(totalPages).fill(0);

  const paginatedUsers = data?.users?.filter(
    (user) =>
      user.userid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
  ) as ZodUserSchema[];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value;
    setCurrentPage(1);
    setSearchTerm(searchString);
  };

  return (
    <div className="w-full p-6 flex flex-col gap-3">
      <h2>All Registered Users</h2>
      <Input
        type="search"
        placeholder="Filter users by ID or Name"
        onChange={(e) => handleChange(e)}
        className="w-1/4 mb-3"
      />
      <UserTable paginatedUsers={paginatedUsers} />
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              />
            </PaginationItem>
          )}

          {pageArray &&
            pageArray?.map((_, index) => {
              const isActive = index + 1 === currentPage;
              return (
                <PaginationItem key={`page ${index + 1}`}>
                  <PaginationLink
                    href="#"
                    isActive={isActive}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
