"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button"; // Import shadcn button

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const navLinks = [
    { name: "Library", href: "/" },
    { name: "Add New", href: "/books/new" },
  ];

  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-[#FDFCF8]">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image
            src="/assets/logo.png"
            alt="Bookified"
            width={42}
            height={26}
          />
        </Link>
        <span className="text-xl font-semibold text-zinc-800 tracking-tight">
          Bookified
        </span>
      </div>

      {/* Auth & Navigation */}
      <div className="flex items-center gap-10">
        <Show when="signed-in">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-zinc-900"
                      : "text-stone-500 hover:text-zinc-700"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 w-full h-[2.5px] bg-[#634832] rounded-full" />
                  )}
                </Link>
              );
            })}
            <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
              <UserButton />
              {user?.firstName && (
                <Link
                  href="/subscriptions"
                  className="hidden md:block font-serif text-sm italic text-stone-500 hover:text-[#634832] transition-colors"
                >
                  {user.firstName}’s Library
                </Link>
              )}
            </div>
          </div>
        </Show>

        <Show when="signed-out">
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className="text-stone-500 hover:text-zinc-900"
              >
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button
                size="sm"
                className="bg-zinc-900 text-white hover:bg-zinc-800"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
