"use client";

import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { useUser } from "@clerk/clerk-react";
import { useAtom } from "jotai";
import { userAtom, userEmailAtom } from "@/atom/userAtoms";
import { useEffect } from "react";
import { Toast } from "./ui/toast";

export function Navbar() {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useUser();
  const [userData, setUser] = useAtom(userAtom);
  console.log(userData);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/">
          <img
            src="/logo.jpeg"
            alt="logo"
            className="w-48 h-10 mt-2 object-cover"
          />
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/instructors"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/instructors")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Instructors
          </Link>

          {(isSignedIn && isLoaded) || userData ? (
            <Avatar>
              <Link to="/profile">
                <AvatarImage
                  src={userData?.photoUrl || "https://github.com/shadcn.png"}
                  alt={userData?.name || "@events"}
                />
              </Link>
            </Avatar>
          ) : (
            <Button variant="ghost">
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </Button>
          )}

          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
