"use client";
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Navbar() {

  const user = useCurrentUser();

  return (
    <header className="shadow-sm">
      <nav className="m-auto flex max-w-5xl items-center justify-between px-3 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} width={40} height={40} alt="Flow Jobs logo" />
          <span className="text-xl font-bold tracking-tight">Flow Jobs</span>
        </Link>
        <div className="flex gap-3 items-center">
          <h1 className="font-bold">( {user?.name} )</h1>
          <LogoutButton>
            Logout
          </LogoutButton>
          <Button asChild>
            <Link href="/jobs/new">Post a job</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
