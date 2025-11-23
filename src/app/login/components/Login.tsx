"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema, ZodAdminSchema } from "@/lib/adminSchema";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoginResponse } from "@/app/api/login/route";
import { useLocalStorage } from "usehooks-ts";
import { DashboardAPIPath } from "@/enums/apiPaths.enum";
export default function Login() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [adminProfile, setAdminProfile] = useLocalStorage<ZodAdminSchema | null>(
    "admin-profile",
    null,
    {
      serializer: (value) => JSON.stringify(value),
    }
  );

  type LoginError = {
    error: {
      name: string;
      message: string;
      expiredAt: string;
    };
  };

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: unknown) => {
    try {
      const response = await fetch(DashboardAPIPath.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: LoginError = await response.json();

        setError("root", {
          type: "manual",
          message: `${errorData.error.message}`,
        });
        setFocus("email");
        return;
      }
      const result: LoginResponse = await response.json();
      if (!adminProfile) setAdminProfile(result?.adminUser);
      setIsAuthenticated(true);
      router.push("/manage");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={3}>
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
            {...register("email")}
            label="Email"
            variant="outlined"
            error={!!errors.email}
            sx={{ flex: 1 }}
            helperText={errors.email && errors.email.message}
            slotProps={{ htmlInput: { autoComplete: "off" } }}
          />

          <TextField
            {...register("password")}
            label="Password"
            variant="outlined"
            error={!!errors.password}
            sx={{ flex: 1 }}
            helperText={errors.password && errors.password.message}
            slotProps={{ htmlInput: { autoComplete: "off" } }}
          />
        </Stack>

        {errors.root?.message && <Alert role="alert">{errors?.root.message}?</Alert>}

        <Button disabled={!isValid} variant="contained" type="submit" loading={isSubmitting}>
          Sign In As Admin
        </Button>
      </Stack>
    </form>
  );
}
