'use client'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { AlignJustify } from "lucide-react";


export function Header() {
  const {user} = useUser()
  
  return (
    <header className="w-full p-4 border-b bg-background text-gray-900">
      <div className="flex flex-row justify-center items-center gap-2">
        <SignedIn>
          <AlignJustify />
          <h1 className="text-lg  font-bold text-center">{user?.primaryEmailAddress?.emailAddress}</h1>
        </SignedIn>
            <SignedOut>
              <SignInButton />
              <SignUpButton>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}