import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <Card className="mb-12 p-6 border-[#ff9900]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2 font-serif">
            Peça sua Roupa Personalizada
          </h2>
          <p className="text-muted-foreground mb-4">
            Crie uma peça única que se ajusta perfeitamente ao seu estilo e
            medidas.
          </p>
        </div>
        <Link href="/cliente/criar-pedido">
          <Button className="bg-[#ff9900] text-[#232f3e] hover:bg-[#ffac31]">
            <PlusCircleIcon className="mr-2" />
            Criar Pedido
          </Button>
        </Link>
      </div>
    </Card>
  );
}
