"use client";

import { ZodUserSchema } from "@/lib/adminSchema";
import dynamic from "next/dynamic";
import { useLocalStorage } from "usehooks-ts";

import CreateUserForm from "./components/CreateUserForm";
import Loading from "../components/loading";

const UserTable = dynamic(() => import("@/components/UserTable"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function CreateUser() {
  const [users] = useLocalStorage<ZodUserSchema[]>("new-users", []);

  return (
    <div className="flex gap-4 m-3 flex-1">
      <CreateUserForm />

      <div className="flex-3 p-3 border-solid border-1 rounded-2xl mb-3">
        <h2>Newly Added Users</h2>
        <UserTable paginatedUsers={users} />
      </div>
    </div>
  );
}
