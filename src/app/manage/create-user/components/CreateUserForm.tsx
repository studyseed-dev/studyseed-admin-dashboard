import React, { SyntheticEvent, useState } from "react";
import {
  Box,
  Stack,
  FormControl,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  Alert,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

import { ZodUserSchema } from "@/lib/adminSchema";
import { generateRandomLetters, initializeProgress } from "@/lib/helperFunctions";
import AddIcon from "@mui/icons-material/Add";
import BasicContainer from "@/components/BasicContainer";
import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { Course } from "@/enums/courses.enum";
import EnrolledCoursesDialog from "./EnrolledCoursesDialog";

export default function CreateUserForm() {
  const router = useRouter();
  const {
    reset,
    resetField,
    setFocus,
    setError,
    handleSubmit,
    register,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext<ZodUserSchema>();

  const { remove } = useFieldArray({ control, name: "enrolled_courses" });

  // only need setter here; the stored array itself isn't used directly in this component
  const [, setUserArr] = useLocalStorage<ZodUserSchema[]>("new-users", []);

  const [open, setOpen] = useState(false);
  const [showRedirecting, setShowRedirecting] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  // Watch the values of firstName and lastName fields
  const firstName = watch("first_name");
  const lastName = watch("last_name");
  const userid = watch("userid");
  const enrolledCourses = watch("enrolled_courses");

  const onSubmit = async () => {
    try {
      // Small artificial delay to keep parity with previous behavior
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const formData = getValues();

      const reqBody = {
        ...formData,
        progress: initializeProgress(
          formData.enrolled_courses.map((courseObj) => courseObj.course) as Course[],
        ),
      };

      // Use the mutation hook to perform the POST request
      // mutateAsync generics can be awkward in this project's TS setup; use ts-ignore to call with the prepared body
      // (the mutation is typed above via CreateUserBody)
      await createUserMutation.mutateAsync(reqBody);
    } catch (error) {
      // Errors are handled in mutation onError, but log unexpected ones
      console.error("Unexpected error:", error);
    }
  };

  // --- React Query mutation: create a new user ---
  const queryClient = useQueryClient();

  type CreateUserResponse = { savedResult?: ZodUserSchema; message?: string };
  type CreateUserBody = ZodUserSchema & { progress: Record<string, unknown> };

  const createUserFn = async (body: CreateUserBody) => {
    const res = await fetch(DashboardAPIPath.CREATE_NEW_USER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data?.message || "Error creating user") as Error & { status?: number };
      err.status = res.status;
      throw err;
    }
    return data;
  };

  const createUserMutation = useMutation<
    CreateUserResponse,
    Error & { status?: number },
    CreateUserBody
  >({
    mutationFn: createUserFn,
    onSuccess: (data: CreateUserResponse) => {
      if (data && data.savedResult) {
        setUserArr((prev) => [...(prev ?? []), data.savedResult as ZodUserSchema]);
      }
      // Invalidate any users query so other components can refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      setSnackBarOpen(true);
    },
    onError: (error: Error & { status?: number }) => {
      // Mirror previous behavior for specific status codes
      const status = error?.status;
      setError("root", { type: "manual", message: error?.message || "Unexpected error" });
      if (status === 401) {
        setShowRedirecting(true);
        setTimeout(() => router.push("/"), 3000);
      }
      if (status === 409) {
        resetField("userid");
        setFocus("userid");
      }
    },
  });

  const handleAutoGenerate = () => {
    const { first_name, last_name } = getValues();
    const generatedUserId = `${first_name[0].toUpperCase()}${last_name[0].toUpperCase()}01${generateRandomLetters(
      2,
    )}`;
    setValue("userid", generatedUserId, { shouldDirty: true, shouldValidate: true });
  };

  const handleSBClose = (event: Event | SyntheticEvent<Event>, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setSnackBarOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flex: 1,
      }}
    >
      <BasicContainer>
        <FormControl
          sx={{
            ".MuiFormHelperText-contained": {
              position: "absolute",
              top: "100%",
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
              p: 3,
            }}
          >
            <Typography variant="h5">Create User</Typography>
            <Stack
              gap={3}
              sx={{
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
              }}
            >
              <TextField
                {...register("first_name")}
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                error={!!errors.first_name}
                sx={{ flex: 1 }}
                helperText={errors.first_name && errors.first_name.message}
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                }}
              />
              <TextField
                {...register("last_name")}
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                error={!!errors.last_name}
                sx={{ flex: 1 }}
                helperText={errors.last_name && errors.last_name.message}
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                }}
              />
            </Stack>

            <Stack direction={"row"} gap={3}>
              <TextField
                {...register("userid")}
                id="outlined-basic"
                label="User ID"
                variant="outlined"
                error={!!errors.userid}
                helperText={errors.userid && errors.userid.message}
                slotProps={{
                  inputLabel: { shrink: !!userid },
                  htmlInput: {
                    autoComplete: "off",
                  },
                }}
                sx={{
                  flex: 1,
                }}
              />

              <Box
                sx={{
                  flex: 1,
                }}
              >
                <Button
                  variant="contained"
                  aria-disabled={!firstName || !lastName}
                  onClick={handleAutoGenerate}
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  Auto-generate
                </Button>
              </Box>
            </Stack>

            <Divider />

            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h6">Enrolled Courses</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
                Add course
              </Button>
            </Stack>

            <EnrolledCoursesDialog open={open} handleClose={handleClose} />

            <Stack direction={"row"} gap={1}>
              {enrolledCourses.map((field, index) => (
                <div key={field.course}>
                  <Chip key={field.course} label={field.course} onDelete={() => remove(index)} />
                </div>
              ))}
            </Stack>

            <Button
              disabled={!isValid}
              variant="contained"
              type="submit"
              loading={isSubmitting || showRedirecting}
              loadingPosition="end"
            >
              {showRedirecting ? "Redirecting to log in page..." : "Create New User"}
            </Button>
            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
          </Box>
        </FormControl>
      </BasicContainer>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={(event, reason) => handleSBClose(event, reason)}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          New User Registered!
        </Alert>
      </Snackbar>
    </Box>
  );
}
