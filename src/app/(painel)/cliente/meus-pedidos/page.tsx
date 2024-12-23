"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Proposal = {
  id: number;
  costureira_id: string;
  valor: number;
  descricao: string;
  tempo_estimado: number;
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  created_at: string;
  costureira: {
    nome_completo: string;
  };
};

type Job = {
  id: number;
  tipo_roupa: string;
  descricao: string;
  prazo_entrega: string;
  orcamento_maximo: number;
  status: string;
  created_at: string;
  propostas: Proposal[];
};

export default function MeusPedidos() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("pedidos")
        .select(
          `
          *,
          propostas (
            *,
            costureira:usuarios (nome_completo)
          )
        `
        )
        .eq("usuario_id", sessionData.session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar seus pedidos. Por favor, tente novamente mais tarde.",
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
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-500";
      case "em andamento":
        return "bg-blue-500";
      case "concluído":
        return "bg-green-500";
      case "cancelado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAcceptProposal = async (jobId: number, proposalId: number) => {
    try {
      const { error: updateJobError } = await supabase
        .from("pedidos")
        .update({ status: "em andamento" })
        .eq("id", jobId);

      if (updateJobError) throw updateJobError;

      const { error: updateProposalError } = await supabase
        .from("propostas")
        .update({ status: "aceita" })
        .eq("id", proposalId);

      if (updateProposalError) throw updateProposalError;

      toast({
        title: "Sucesso",
        description: "Proposta aceita com sucesso!",
      });

      loadJobs(); // Reload jobs to reflect the changes
    } catch (error) {
      console.error("Erro ao aceitar proposta:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível aceitar a proposta. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleRejectProposal = async (proposalId: number) => {
    try {
      const { error } = await supabase
        .from("propostas")
        .update({ status: "recusada" })
        .eq("id", proposalId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Proposta recusada com sucesso!",
      });

      loadJobs(); // Reload jobs to reflect the changes
    } catch (error) {
      console.error("Erro ao recusar proposta:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível recusar a proposta. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Você ainda não fez nenhum pedido.
            </p>
            <Button
              className="mt-4 mx-auto block"
              onClick={() => router.push("/cliente/criar-pedido")}
            >
              Criar Novo Pedido
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{job.tipo_roupa}</h2>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Prazo: {formatDate(job.prazo_entrega)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span>
                      Orçamento: R$ {job.orcamento_maximo?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Criado em: {formatDate(job.created_at)}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{job.descricao}</p>

                <h3 className="text-lg font-semibold mb-2">
                  Propostas Recebidas
                </h3>
                {job.propostas.length === 0 ? (
                  <p className="text-muted-foreground">
                    Ainda não há propostas para este pedido.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Costureira</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Tempo Estimado</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {job.propostas.map((proposal) => (
                        <TableRow key={proposal.id}>
                          <TableCell>
                            {proposal.costureira.nome_completo}
                          </TableCell>
                          <TableCell>R$ {proposal.valor.toFixed(2)}</TableCell>
                          <TableCell>{proposal.tempo_estimado} horas</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(proposal.status)}>
                              {proposal.status.charAt(0).toUpperCase() +
                                proposal.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {proposal.status === "pendente" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleAcceptProposal(job.id, proposal.id)
                                  }
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Aceitar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleRejectProposal(proposal.id)
                                  }
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  Recusar
                                </Button>
                              </div>
                            )}
                            {proposal.status !== "pendente" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(
                                    `/cliente/proposta/${proposal.id}`
                                  )
                                }
                              >
                                Ver Detalhes
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
