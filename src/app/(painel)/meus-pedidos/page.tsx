"use client";

import { IPedidos } from "@/@types/collections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/client";
import {
  Calendar,
  DollarSign,
  FactoryIcon as Fabric,
  Palette,
  Ruler,
  ShirtIcon as Tshirt,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<IPedidos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("pedidos")
          .select("*")
          .eq("usuario_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPedidos(data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setError(
          "Não foi possível carregar seus pedidos. Por favor, tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [supabase, user]);

  if (loading)
    return <div className="text-center mt-8">Carregando seus pedidos...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "em produção":
        return "bg-yellow-500";
      case "aguardando aprovação":
        return "bg-blue-500";
      case "concluído":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
      {/* <div className="space-y-4"> */}
      {/* DOIS ITENS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {pedidos.map((pedido) => (
          <Card key={pedido.id} className="w-full">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  {/* <h2 className="text-2xl font-semibold">{pedido.tipoRoupa}</h2> */}
                  <h2 className="text-2xl font-semibold">
                    Pedido #{pedido.id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDate(pedido.created_at)}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(
                    pedido?.status ?? "aguardando aprovação"
                  )} mt-2 md:mt-0`}
                >
                  {pedido.status ?? "Aguardando aprovação"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Tshirt className="w-5 h-5 mr-2" />
                  <span>{pedido.estilo}</span>
                </div>
                <div className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  <span>{pedido.cor}</span>
                </div>
                <div className="flex items-center">
                  <Fabric className="w-5 h-5 mr-2" />
                  <span>{pedido.material}</span>
                </div>
                <div className="flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  <span>Tamanho: {pedido.tamanho}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>Orçamento: R$ {pedido.orcamentoMaximo}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Prazo: {pedido.prazoEntrega} dias</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Ver Detalhes</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Detalhes do Pedido #{pedido.id}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Tipo:</span>
                        <span className="col-span-3">{pedido.tipoRoupa}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Cor:</span>
                        <span className="col-span-3">{pedido.cor}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Estilo:</span>
                        <span className="col-span-3">{pedido.estilo}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Material:</span>
                        <span className="col-span-3">{pedido.material}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Tamanho:</span>
                        <span className="col-span-3">{pedido.tamanho}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Orçamento:</span>
                        <span className="col-span-3">
                          R$ {pedido.orcamentoMaximo}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Prazo:</span>
                        <span className="col-span-3">
                          {pedido.prazoEntrega} dias
                        </span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Status:</span>
                        <span className="col-span-3">{pedido.status}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Detalhes:</span>
                        <span className="col-span-3">{pedido.detalhes}</span>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
