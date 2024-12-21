"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { ProfileMenu } from "../profile-menu";

export function AuthButtons() {
  const { session } = useAuth();

  if (session) {
    return <ProfileMenu />;
  }

  return (
    <Link href="/entrar">
      <Button variant="ghost" className="text-white hover:text-[#ff9900]">
        <UserIcon className="h-5 w-5 mr-1" />
        Entrar
      </Button>
    </Link>
  );
}
