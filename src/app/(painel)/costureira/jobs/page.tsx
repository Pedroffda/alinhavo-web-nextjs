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
import {
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Palette,
  Ruler,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AvailableJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      let query = supabase
        .from("pedidos")
        .select("*")
        .is("costureira_id", null)
        .order(sortBy, { ascending: false });

      if (filter) {
        query = query.ilike("tipo_roupa", `%${filter}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data);
    } catch (error) {
      console.error("Erro ao carregar trabalhos:", error);
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

  const handleBid = async (jobId: string) => {
    // Implement bid logic here
    console.log(`Bid placed for job ${jobId}`);
    // You would typically open a modal or navigate to a new page to place a bid
    router.push(`/costureira/jobs/${jobId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <Button onClick={loadJobs}>Aplicar</Button>
      </div>

      <div className="grid gap-6">
        {jobs.map((job: any) => (
          <Card key={job.id} className="overflow-hidden">
            <CardHeader className="bg-secondary">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{job.tipo_roupa}</CardTitle>
                  <CardDescription>
                    Publicado em {formatDate(job.created_at)}
                  </CardDescription>
                </div>
                <Badge variant={job.urgente ? "destructive" : "secondary"}>
                  {job.urgente ? "Urgente" : "Normal"}
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
                  <span>Orçamento: R$ {job.orcamento_maximo?.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <span>Tamanho: {job.tamanho}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <span>Cor: {job.cor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Tempo estimado: {job.tempo_estimado} horas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>Local: {job.local_entrega}</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{job.descricao}</p>
              <div className="flex items-center justify-end">
                <Button onClick={() => handleBid(job.id)}>
                  Fazer Proposta
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
