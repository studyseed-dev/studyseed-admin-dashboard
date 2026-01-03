"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Stack } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { useLocalStorage } from "usehooks-ts";

import { useAuth } from "@/context/AuthContext";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ZodAdminSchema } from "@/lib/adminSchema";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { DashboardPagePath } from "@/enums/pagePaths.enum";

const dashboardPages = [
  {
    pageName: "Home",
    href: DashboardPagePath.HOME,
  },
  {
    pageName: "Create User",
    href: DashboardPagePath.CREATE_NEW_USER,
  },
  {
    pageName: "Users Overview",
    href: DashboardPagePath.USERS_OVERVIEW,
  },
  {
    pageName: "Manage Questions",
    href: DashboardPagePath.MANAGE_QUESTIONS,
  },
];

export default function NavBar() {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, setIsAuthenticated, isLoading } = useAuth();
  const [adminProfile] = useLocalStorage("admin-profile", {} as ZodAdminSchema, {
    deserializer: (value) => JSON.parse(value),
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    const logout = async () => {
      try {
        // note: include / in front of the URL to make it absolute, otherwise it will be relative to the current path
        await fetch("/api/logout");
        localStorage.clear();
        setIsAuthenticated(false);
      } catch (error) {
        console.error({ message: "unexpected logout error", error });
      }
    };

    logout();
    router.push(DashboardPagePath.HOME);
  };

  const handleLogin = () => router.push(DashboardPagePath.LOGIN);

  return (
    <Stack>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          p: 3,
          height: "80px",
          border: "1px solid rgba(51, 51, 51, 0.3)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Link href="/">
            <Image
              alt="studyseed logo"
              src={"https://ik.imagekit.io/jbyap95/studyseed-logo-original.png"}
              width={200}
              height={80}
            />
          </Link>
        </Box>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="hover:cursor-pointer">
                {adminProfile?.username?.[0].toUpperCase()}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-8">
              <DropdownMenuLabel>Admin: {adminProfile.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem disabled>{adminProfile.email}</DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className="flex items-center gap-2 hover:underline hover:underline-offset-4 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogoutRoundedIcon />
                  <p>Log Out</p>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          !isLoading &&
          pathName !== DashboardPagePath.LOGIN && (
            <button
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 cursor-pointer"
              onClick={handleLogin}
            >
              <LoginRoundedIcon />
              <p>LOG IN</p>
            </button>
          )
        )}
      </Box>
      <NavigationMenu orientation="horizontal">
        <NavigationMenuList>
          {dashboardPages.map((page) => (
            <NavigationMenuItem key={page.pageName}>
              <NavigationMenuLink asChild data-active={isMounted && pathName === page.href}>
                <Link href={page.href}>{page.pageName}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </Stack>
  );
}
