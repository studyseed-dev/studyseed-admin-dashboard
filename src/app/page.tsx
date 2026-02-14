import { Button } from "@/components/ui/button";
import { DashboardPagePath } from "@/enums/pagePaths.enum";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center m-auto">
      <div>
        <h1>Welcome to Studyseed User Manager</h1>
        <p className="mb-2">Easily add new users to the system or browse existing user accounts.</p>
      </div>

      <Link href={DashboardPagePath.CREATE_NEW_USER} passHref>
        <Button className="bg-studyseed-blue">Get Started</Button>
      </Link>
    </div>
  );
}
