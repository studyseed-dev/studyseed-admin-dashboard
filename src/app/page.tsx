"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { DashboardPagePath } from "@/enums/pagePaths.enum";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center m-auto">
      <div>
        <h1>Welcome to Studyseed User Manager</h1>
        <p className="mb-2">Easily add new users to the system or browse existing user accounts.</p>
      </div>
      <Link
        href={isAuthenticated ? DashboardPagePath.CREATE_NEW_USER : DashboardPagePath.LOGIN}
        passHref
      >
        <Button className="bg-studyseed-blue">{isAuthenticated ? "Get Started" : "Login"}</Button>
      </Link>
    </div>
  );
}
