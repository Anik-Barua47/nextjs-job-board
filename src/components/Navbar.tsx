"use client";
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function Navbar() {
  const user = useCurrentUser();

  return (
    <header className="shadow-sm">
      <nav className="m-auto flex max-w-5xl items-center justify-between px-3 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} width={40} height={40} alt="Flow Jobs logo" />
          <span className="text-xl font-bold tracking-tight">Flow Jobs</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/jobs/new">Post a job</Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback className="border border-black">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="mt-5 w-56" align="end" forceMount>
                <DropdownMenuLabel className="flex justify-between">
                  <h1>{user?.name}</h1>
                  <span className="rounded-lg border bg-slate-200 px-1 text-xs lowercase">
                    {user?.role}
                  </span>
                </DropdownMenuLabel>
                {/* Show Dashboard link only for admin */}
                {user?.role === "ADMIN" && (
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/admin" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="cursor-pointer">
                  <LogoutButton>Logout</LogoutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
