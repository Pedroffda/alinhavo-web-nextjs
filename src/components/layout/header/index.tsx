import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScissorsIcon, SearchIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import AuthButtons from "./auth-buttons";

export function Header() {
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:text-[#ff9900]"
                  >
                    Categorias
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Vestidos</DropdownMenuItem>
                  <DropdownMenuItem>Camisas</DropdownMenuItem>
                  <DropdownMenuItem>Calças</DropdownMenuItem>
                  <DropdownMenuItem>Saias</DropdownMenuItem>
                  <DropdownMenuItem>Acessórios</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Button
                variant="ghost"
                className="text-white hover:text-[#ff9900]"
              >
                Ofertas do Dia
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="text-white hover:text-[#ff9900]"
              >
                Costureiros em Destaque
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="text-white hover:text-[#ff9900]"
              >
                Como Funciona
              </Button>
            </li>
            <li>
              <Link href="/criar-pedido">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#ff9900]"
                >
                  Criar Pedido
                </Button>
              </Link>
            </li>
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
          </ul>
        </div>
      </nav>
    </>
  );
}
