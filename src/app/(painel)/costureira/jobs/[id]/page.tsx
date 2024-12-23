"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JobChat } from "@/components/wrapper/chat";
import { ClientInfo } from "@/components/wrapper/proposta/client-info";
import { JobDetails } from "@/components/wrapper/proposta/details";
import { JobHeader } from "@/components/wrapper/proposta/header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Message = {
  id: number;
  proposta_id: number;
  sender_id: string;
  content: string;
  created_at: string;
};

type Job = {
  id: number;
  tipo_roupa: string;
  descricao: string;
  prazo_entrega: string;
  orcamento_maximo: number;
  status: string;
  detalhes_adicionais: string;
  cliente: {
    id: string;
    nome_completo: string;
    avatar_url: string;
  };
};

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
  mensagens: Message[];
};

export default function JobDetail() {
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadJobAndProposal();
  }, []);

  async function loadJobAndProposal() {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const userId = sessionData.session.user.id;

      const { data: jobData, error: jobError } = await supabase
        .from("pedidos")
        .select(
          `
          *,
          cliente:usuarios!pedidos_usuario_id_fkey (id, nome_completo, avatar_url)
        `
        )
        .eq("id", params.id)
        .single();

      if (jobError) throw jobError;

      const { data: proposalData, error: proposalError } = await supabase
        .from("propostas")
        .select(
          `
          *,
          mensagens (*)
        `
        )
        .eq("pedido_id", params.id)
        .eq("costureira_id", userId)
        .maybeSingle();

      if (proposalError) throw proposalError;

      setJob(jobData);
      setProposal(proposalData);
    } catch (error) {
      console.error("Erro ao carregar trabalho e proposta:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os detalhes do trabalho. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const sendMessage = async (message: string) => {
    if (!proposal || !message.trim()) return;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!job || !proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Trabalho não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="mb-8">
            <CardContent className="mt-4">
              <JobHeader
                tipoRoupa={job.tipo_roupa}
                clienteNome={job.cliente.nome_completo}
                status={job.status}
              />
              <JobDetails
                prazoEntrega={job.prazo_entrega}
                orcamentoMaximo={job.orcamento_maximo}
                descricao={job.descricao}
                detalhesAdicionais={job.detalhes_adicionais}
              />
              <ClientInfo
                nome={job.cliente.nome_completo}
                avatarUrl={job.cliente.avatar_url}
              />
              <Card className="mt-6">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">Sua Proposta</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Valor:</strong> R$ {proposal.valor.toFixed(2)}
                    </p>
                    <p>
                      <strong>Tempo Estimado:</strong> {proposal.tempo_estimado}{" "}
                      horas
                    </p>
                    <p>
                      <strong>Status:</strong> {proposal.status}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {proposal.descricao}
                    </p>
                    <p>
                      <strong>Progresso Atual:</strong> {proposal.progresso}%
                    </p>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6">
                <Link href={`/costureira/jobs/${job.id}/progresso`}>
                  <Button className="w-full">Atualizar Progresso</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <JobChat
            messages={proposal.mensagens}
            clientId={job.cliente.id}
            clientName={job.cliente.nome_completo}
            clientAvatar={job.cliente.avatar_url}
            tailorId={proposal.costureira_id}
            tailorName="Costureira"
            tailorAvatar="/placeholder.svg"
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
