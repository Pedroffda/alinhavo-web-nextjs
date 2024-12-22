"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function ProfileMenu({ user }: Readonly<{ user: User }>) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/auth/signout", {
      method: "POST",
    });
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-white hover:text-[#ff9900]"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={
                user.user_metadata.avatar_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
              }
              alt={user.email ?? ""}
            />
            <AvatarFallback>
              {user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <span>{user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/perfil")}>
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/meus-pedidos")}>
          Meus Pedidos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
