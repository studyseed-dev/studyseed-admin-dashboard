import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ZodUserSchema } from "@/lib/adminSchema";
import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocalStorage } from "usehooks-ts";

type DeleteUserBody = {
  userid: string;
};

const deleteUserFn = async (body: DeleteUserBody) => {
  const res = await fetch(DashboardAPIPath.DELETE_USER, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.message || "Error deleting user") as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data;
};

interface UserTableProps {
  paginatedUsers: ZodUserSchema[];
  caption?: string;
}

export default function UserTable({ paginatedUsers, caption }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<ZodUserSchema | undefined>(undefined);
  const [users, setUsers] = useLocalStorage<ZodUserSchema[]>("new-users", []);
  const queryClient = useQueryClient();

  const { mutate } = useMutation<
    { message: string },
    Error & { status?: number },
    { userid: string }
  >({
    mutationFn: deleteUserFn,
    onSuccess: (data: { message: string }) => {
      setUsers(users.filter((user) => user.userid !== selectedUser?.userid));
      setSelectedUser(undefined);
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      toast.success(`${data.message}`);
    },
    onError: (error: Error & { status?: number }) => {
      setSelectedUser(undefined);
      console.error(`Error deleting user. ${error}`);
      toast.error(`${error}`);
    },
  });

  const handleCopyUserID = (userid: string) => {
    navigator.clipboard
      .writeText(userid)
      .then(() => toast.success(`User ID ${userid} copied!`))
      .catch(() => toast.error("Failed to copy"));
  };

  const handleDeleteUser = () => {
    if (!selectedUser || !selectedUser.userid) return;
    mutate({ userid: selectedUser.userid });
  };

  return (
    <Dialog>
      <DialogTitle className="sr-only" />
      <DialogContent>
        <DialogHeader>Action</DialogHeader>
        <p id="server-modal-description">
          Are you sure you want to delete{" "}
          <strong>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </strong>
          ? This action cannot be undone.
        </p>
        <DialogClose asChild>
          <Button onClick={handleDeleteUser}>Confirm</Button>
        </DialogClose>
      </DialogContent>

      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Subjects</TableHead>
            <TableHead className="text-right">Courses</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers?.map((user, index) => (
            <TableRow key={`${index} - ${user}`}>
              <TableCell className="font-medium flex items-center gap-2">
                <Button variant="ghost" onClick={() => handleCopyUserID(user.userid)}>
                  <Copy size={15} />
                </Button>

                {user.userid}
              </TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.courses?.join(", ")}</TableCell>
              <TableCell className="flex items-center font-medium gap-2 justify-end">
                {user.enrolled_courses?.join(", ")}
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                  >
                    <Trash2 size={15} />
                  </Button>
                </DialogTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Dialog>
  );
}
