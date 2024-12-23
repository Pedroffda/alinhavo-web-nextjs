"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JobChat } from "@/components/wrapper/chat";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import {
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  Scissors,
  Star,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Proposal = {
  id: number;
  pedido_id: number;
  costureira_id: string;
  valor: number;
  descricao: string;
  tempo_estimado: number;
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  created_at: string;
  progresso: number;
  costureira: {
    id: string;
    nome_completo: string;
    avatar_url: string;
    avaliacao_media: number;
    trabalhos_concluidos: number;
  };
  pedido: {
    usuario_id: string;
    tipo_roupa: string;
    descricao: string;
    prazo_entrega: string;
    orcamento_maximo: number;
    status: string;
    detalhes_adicionais: string;
  };
  mensagens: Array<{
    id: number;
    proposta_id: number;
    sender_id: string;
    content: string;
    created_at: string;
  }>;
};

export default function ProposalDetail() {
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const params = useParams();
  const { toast } = useToast();

  useEffect(() => {
    loadProposal();
  }, []);

  async function loadProposal() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("propostas")
        .select(
          `
          *,
          costureira:usuarios!propostas_costureira_id_fkey (id, nome_completo, avatar_url),
          pedido:pedidos (*),
          mensagens (*)
        `
        )
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setProposal(data);
    } catch (error) {
      console.error("Erro ao carregar proposta:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os detalhes da proposta. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const sendMessage = async (message: string) => {
    if (!proposal) return;

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("mensagens")
        .insert({
          proposta_id: proposal.id,
          sender_id: sessionData.session.user.id,
          content: message.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setProposal({
        ...proposal,
        mensagens: [...proposal.mensagens, data],
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível enviar a mensagem. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Proposta não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">
                  Proposta para {proposal.pedido.tipo_roupa}
                </CardTitle>
                <CardDescription>
                  Enviada em {formatDate(proposal.created_at)}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(proposal.status)}>
                {proposal.status.charAt(0).toUpperCase() +
                  proposal.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span>Valor proposto: R$ {proposal.valor.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Tempo estimado: {proposal.tempo_estimado} horas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  Prazo do pedido: {formatDate(proposal.pedido.prazo_entrega)}
                </span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Descrição da Proposta
              </h3>
              <p className="text-muted-foreground">{proposal.descricao}</p>
            </div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informações da Costureira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={proposal.costureira.avatar_url} />
                    <AvatarFallback>
                      {proposal.costureira.nome_completo.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {proposal.costureira.nome_completo}
                    </p>
                    <p className="text-sm text-muted-foreground">Costureira</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>
                      Avaliação Média:{" "}
                      {/* {proposal.costureira.avaliacao_media.toFixed(1)} */}
                      4.7
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Scissors className="h-5 w-5 text-muted-foreground" />
                    <span>
                      Trabalhos Concluídos:{" "}
                      {/* {proposal.costureira.trabalhos_concluidos} */}
                      12
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {proposal.status === "aceita" && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Progresso do Trabalho</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={proposal.progresso} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {proposal.progresso}% concluído
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
        <Card>
          {/* <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent> */}
          <JobChat
            messages={proposal.mensagens}
            clientId={proposal.pedido.usuario_id}
            clientName="Cliente" // You might want to fetch the client's name
            clientAvatar="/placeholder.svg" // You might want to fetch the client's avatar
            tailorId={proposal.costureira_id}
            tailorName={proposal.costureira.nome_completo}
            tailorAvatar={proposal.costureira.avatar_url}
            onSendMessage={sendMessage}
          />
          {/* </CardContent> */}
        </Card>
      </div>
    </div>
  );
}
