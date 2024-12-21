"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<any>([]);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Meus Pedidos
          </CardTitle>
          <CardDescription className="text-center">
            Acompanhe o status dos seus pedidos personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pedidos.length === 0 ? (
            <p className="text-center">
              Você ainda não tem pedidos. Que tal{" "}
              <a href="/criar-pedido" className="text-blue-500 hover:underline">
                criar um agora
              </a>
              ?
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Roupa</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Estilo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido: any) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.tipoRoupa}</TableCell>
                    <TableCell>{pedido.tamanho}</TableCell>
                    <TableCell>{pedido.cor}</TableCell>
                    <TableCell>{pedido.estilo}</TableCell>
                    <TableCell>{pedido.status || "Em análise"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
