import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { supabase } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { ScissorsIcon, SearchIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import AuthButtons from "./auth-buttons";

export async function Header() {
  const supabase = await createClient();

  // Tente obter o usuário autenticado
  const {
    data: { user },
    error: authUserError,
  } = await supabase.auth.getUser();

  if (authUserError) {
    console.error("Erro ao buscar usuário autenticado:", authUserError.message);
  }

  let userData = null;

  // Se houver um usuário autenticado, busque os dados adicionais
  if (user) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar dados do usuário:", error.message);
    } else {
      userData = data;
    }
  }

  return (
    <>
      <header className="bg-[#232f3e] text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" passHref className="flex item-center">
              <ScissorsIcon className="h-8 w-8 text-[#ff9900] mr-2" />
              <span className="text-2xl font-bold">Alinhavo</span>
            </Link>
            <div className="flex-1 mx-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Busque por peças, estilos ou costureiros..."
                  className="w-full py-2 px-4 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-[#ff9900]"
                />
                <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <nav className="hidden md:flex space-x-4">
              <AuthButtons />
              <Button
                variant="ghost"
                className="text-white hover:text-[#ff9900]"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-1" />
                Carrinho
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <nav className="bg-[#37475a] text-white">
        <div className="container mx-auto px-4 py-2">
          <ul className="flex justify-between items-center">
            <li>
              <Link href="/cliente/criar-pedido">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#ff9900]"
                >
                  Criar Pedido
                </Button>
              </Link>
            </li>
            {userData?.tipo_usuario === "costureiro" && (
              <li>
                <Link href="/costureira/jobs">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-[#ff9900]"
                  >
                    Trabalhos
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
