import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import { ButtonBase, Typography } from "@mui/material";
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
  DialogTrigger,
} from "@/components/ui/dialog";

type DeleteUserBody = {
  userid: string;
};

const deleteUserFn = async (body: DeleteUserBody) => {
  const res = await fetch(DashboardAPIPath.DELETE_USER, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
  const queryClient = useQueryClient();

  const { mutate } = useMutation<
    { message: string },
    Error & { status?: number },
    { userid: string }
  >({
    mutationFn: deleteUserFn,
    onSuccess: (data: { message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      toast.success(`${data.message}`);
    },
    onError: (error: Error & { status?: number }) => {
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
      <DialogContent>
        <DialogHeader>Action</DialogHeader>
        <Typography id="server-modal-description" sx={{ pt: 2 }}>
          Are you sure you want to delete{" "}
          <strong>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </strong>
          ? This action cannot be undone.
        </Typography>
        <DialogClose asChild>
          <Button onClick={handleDeleteUser}>Confirm</Button>
        </DialogClose>
      </DialogContent>

      <Table>
        <TableCaption>
          {!!caption
            ? caption
            : paginatedUsers?.length > 0
            ? "A list of recently added users"
            : "No users have been added yet"}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead className="text-right">Course Enrolled</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers?.map((user, index) => (
            <TableRow key={`${index} - ${user}`}>
              <TableCell className="font-medium flex gap-2">
                <ButtonBase>
                  <Copy size={15} onClick={() => handleCopyUserID(user.userid)} />
                </ButtonBase>

                {user.userid}
              </TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell className="text-right">{user?.enrolled_courses?.join(", ")}</TableCell>
              <TableCell className="font-medium flex gap-2">
                <DialogTrigger asChild>
                  <ButtonBase>
                    <Trash2
                      size={15}
                      onClick={() => {
                        setSelectedUser(user);
                      }}
                    />
                  </ButtonBase>
                </DialogTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Dialog>
  );
}
