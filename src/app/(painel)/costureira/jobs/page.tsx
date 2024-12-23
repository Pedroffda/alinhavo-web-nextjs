"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { Calendar, DollarSign, Loader2, Palette, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IPedidos {
  id: number;
  tipo_roupa: string;
  detalhes: string;
  prazo_entrega: string;
  orcamento_maximo: number;
  tamanho: string;
  cor: string;
  created_at: string;
  status: string;
}

interface IProposta {
  id: number;
  pedido_id: number;
  status: "pendente" | "aceita" | "recusada";
  valor: number;
  tempo_estimado: number;
}

export default function AvailableJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<IPedidos[]>([]);
  const [userProposals, setUserProposals] = useState<IProposta[]>([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadJobsAndProposals();
  }, []);

  async function loadJobsAndProposals() {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const userId = sessionData.session?.user.id;

      let jobsQuery = supabase
        .from("pedidos")
        .select("*")
        .order(sortBy, { ascending: false });

      if (filter) {
        jobsQuery = jobsQuery.ilike("tipo_roupa", `%${filter}%`);
      }

      const [
        { data: jobsData, error: jobsError },
        { data: proposalsData, error: proposalsError },
      ] = await Promise.all([
        jobsQuery,
        supabase.from("propostas").select("*").eq("costureira_id", userId),
      ]);

      if (jobsError) throw jobsError;
      if (proposalsError) throw proposalsError;

      setJobs(jobsData || []);
      setUserProposals(proposalsData || []);
    } catch (error) {
      console.error("Erro ao carregar trabalhos e propostas:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os trabalhos disponíveis. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleBid = (jobId: number) => {
    router.push(`/costureira/jobs/${jobId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProposalStatus = (jobId: number) => {
    const proposal = userProposals.find((p) => p.pedido_id === jobId);
    return proposal ? proposal.status : null;
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
      <h1 className="text-3xl font-bold mb-6">Trabalhos Disponíveis</h1>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <Input
          placeholder="Filtrar por tipo de roupa"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Mais recentes</SelectItem>
            <SelectItem value="prazo_entrega">Prazo de entrega</SelectItem>
            <SelectItem value="orcamento_maximo">Orçamento máximo</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadJobsAndProposals}>Aplicar</Button>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => {
          const proposalStatus = getProposalStatus(job.id);
          return (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="bg-secondary">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{job.tipo_roupa}</CardTitle>
                    <CardDescription>
                      Publicado em {formatDate(job.created_at)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      job.status === "urgente" ? "destructive" : "secondary"
                    }
                  >
                    {job.status === "urgente" ? "Urgente" : "Normal"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Prazo: {formatDate(job.prazo_entrega)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span>Orçamento: R$ {job.orcamento_maximo.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-5 w-5 text-muted-foreground" />
                    <span>Tamanho: {job.tamanho}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <span>Cor: {job.cor}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{job.detalhes}</p>
                <div className="flex items-center justify-end">
                  {proposalStatus === null && (
                    <Button onClick={() => handleBid(job.id)}>
                      Fazer Proposta
                    </Button>
                  )}
                  {proposalStatus === "pendente" && (
                    <Badge variant="secondary">Proposta Pendente</Badge>
                  )}
                  {proposalStatus === "aceita" && (
                    <Badge variant="success">Proposta Aceita</Badge>
                  )}
                  {proposalStatus === "recusada" && (
                    <Badge variant="destructive">Proposta Recusada</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
