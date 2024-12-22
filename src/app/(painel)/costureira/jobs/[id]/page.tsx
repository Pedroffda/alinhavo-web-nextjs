"use client";

import { IPedidosCompletos } from "@/@types/collections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import {
  Calendar,
  DollarSign,
  Loader2,
  MessageSquare,
  Palette,
  Ruler,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetail() {
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<IPedidosCompletos>({} as IPedidosCompletos);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const params = useParams();
  //   const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadJob();
  }, []);

  async function loadJob() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pedidos")
        .select(
          `
          *,
          usuarios!pedidos_usuario_id_fkey1 (id, nome_completo, avatar_url),
          propostas (*)
        `
        )
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setJob({
        ...data,
        usuarios: data.usuarios[0],
      });
      setProgress(data.progresso || 0);
      setStatus(data.status);
    } catch (error) {
      console.error("Erro ao carregar trabalho:", error);
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

  const updateJobProgress = async () => {
    try {
      const { error } = await supabase
        .from("pedidos")
        .update({ progresso: progress, status: status })
        .eq("id", job.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Progresso atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível atualizar o progresso. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    // Implementação futura do sistema de mensagens
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O sistema de mensagens será implementado em breve.",
    });
    setMessage("");
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
      case "em andamento":
        return "bg-blue-500";
      case "concluído":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Trabalho não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="bg-secondary">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-2">{job.tipo_roupa}</CardTitle>
              <CardDescription>
                Criado em {formatDate(job.created_at)}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(job.status ?? "")}>
              {/* {(job?.status?.charAt(0).toUpperCase() + job?.status?.slice(1)) ?? ""}  */}
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              {/* <span>Prazo: {formatDate(job.prazo_entrega)}</span> */}
              <span>Prazo: {job.prazo_entrega}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              {/* <span>Orçamento: R$ {job.orcamento_maximo.toFixed(2)}</span> */}
              <span>Orçamento: R$ {job.orcamento_maximo}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Ruler className="h-5 w-5 text-muted-foreground" />
              <span>Tamanho: {job.tamanho}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <span>Cor: {job.cor}</span>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Tempo estimado: {job.tempo_estimado} horas</span>
            </div> */}
            {/* <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>Local: {job.local_entrega}</span>
            </div> */}
          </div>
          {/* <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="text-muted-foreground">{job.descricao}</p>
          </div> */}
          <div className="flex items-center space-x-2 mb-6">
            <Avatar className="h-10 w-10">
              <AvatarImage src={job.usuarios.avatar_url ?? ""} />
              <AvatarFallback>
                {job.usuarios.nome_completo?.charAt(0) ?? ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{job.usuarios.nome_completo}</p>
              <p className="text-sm text-muted-foreground">Cliente</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Progresso do Trabalho</h3>
            <Progress value={progress} className="w-full" />
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                min={0}
                max={100}
                className="w-20"
              />
              <span>%</span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={updateJobProgress}>Atualizar Progresso</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comunicação com o Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Digite sua mensagem aqui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={sendMessage} className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" /> Enviar Mensagem
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
