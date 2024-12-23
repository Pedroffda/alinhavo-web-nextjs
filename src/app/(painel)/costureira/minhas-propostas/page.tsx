"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { Calendar, Clock, DollarSign, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Proposal = {
  id: number;
  pedido_id: number;
  valor: number;
  descricao: string;
  tempo_estimado: number;
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  created_at: string;
  pedido: {
    tipo_roupa: string;
    prazo_entrega: string;
    status: string;
  };
};

export default function MinhasPropostas() {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadProposals();
  }, []);

  async function loadProposals() {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("propostas")
        .select(
          `
          *,
          pedido:pedidos (*)
        `
        )
        .eq("costureira_id", sessionData.session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProposals(data);
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar suas propostas. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-500";
      case "aceita":
        return "bg-green-500";
      case "recusada":
        return "bg-red-500";
      case "cancelada":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  const groupProposalsByStatus = () => {
    const grouped: { [key: string]: Proposal[] } = {
      ativas: [],
      pendentes: [],
      recusadas: [],
      canceladas: [],
    };

    proposals.forEach((proposal) => {
      if (
        proposal.status === "aceita" &&
        proposal.pedido.status === "em andamento"
      ) {
        grouped.ativas.push(proposal);
      } else if (proposal.status === "pendente") {
        grouped.pendentes.push(proposal);
      } else if (proposal.status === "recusada") {
        grouped.recusadas.push(proposal);
      } else if (proposal.status === "cancelada") {
        grouped.canceladas.push(proposal);
      }
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const groupedProposals = groupProposalsByStatus();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Minhas Propostas</h1>

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Você ainda não fez nenhuma proposta.
            </p>
            <Button
              className="mt-4 mx-auto block"
              onClick={() => router.push("/costureira/jobs")}
            >
              Procurar Trabalhos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {groupedProposals.ativas.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Trabalhos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                {groupedProposals.ativas.map((proposal) => (
                  <Card key={proposal.id} className="mb-4">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          {proposal.pedido.tipo_roupa}
                        </h3>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status.charAt(0).toUpperCase() +
                            proposal.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>R$ {proposal.valor.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{proposal.tempo_estimado} horas</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            Prazo: {formatDate(proposal.pedido.prazo_entrega)}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="mt-4"
                        onClick={() =>
                          router.push(`/costureira/proposta/${proposal.id}`)
                        }
                      >
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Todas as Propostas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Roupa</TableHead>
                    <TableHead>Valor Proposto</TableHead>
                    <TableHead>Tempo Estimado</TableHead>
                    <TableHead>Prazo do Pedido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data da Proposta</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell>{proposal.pedido.tipo_roupa}</TableCell>
                      <TableCell>R$ {proposal.valor.toFixed(2)}</TableCell>
                      <TableCell>{proposal.tempo_estimado} horas</TableCell>
                      <TableCell>
                        {formatDate(proposal.pedido.prazo_entrega)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status.charAt(0).toUpperCase() +
                            proposal.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(proposal.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/costureira/proposta/${proposal.id}`)
                          }
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
