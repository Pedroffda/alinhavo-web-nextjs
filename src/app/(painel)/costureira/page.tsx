"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import {
  DollarSign,
  Loader2,
  MessageSquare,
  Scissors,
  Search,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IUsuarios {
  id: string;
  nome_completo: string;
  avatar_url: string;
}

interface IPedidos {
  id: number;
  tipo_roupa: string;
  status: string;
  prazo_entrega: string;
  created_at: string;
  valor: number;
}

interface IProposta {
  id: number;
  pedido_id: number;
  status: "pendente" | "aceita" | "recusada";
  valor: number;
  tempo_estimado: number;
}

type IPedidosWithProposals = IPedidos & { propostas: IProposta[] };

const earningsData = [
  { name: "Jan", earnings: 1200 },
  { name: "Fev", earnings: 1800 },
  { name: "Mar", earnings: 2200 },
  { name: "Abr", earnings: 2600 },
  { name: "Mai", earnings: 2400 },
  { name: "Jun", earnings: 3000 },
];

export default function CostureiraDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUsuarios | null>(null);
  const [activeJobs, setActiveJobs] = useState<IPedidosWithProposals[]>([]);
  const [completedJobs, setCompletedJobs] = useState<IPedidos[]>([]);
  const [pendingProposals, setPendingProposals] = useState<IPedidos[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        router.push("/entrar");
        return;
      }

      const [
        userData,
        activeJobsData,
        completedJobsData,
        pendingProposalsData,
      ] = await Promise.all([
        supabase
          .from("usuarios")
          .select("*")
          .eq("id", session.user.id)
          .single(),
        supabase
          .from("pedidos")
          .select("*, propostas!inner(*)")
          .eq("usuario_id", session.user.id)
          .eq("status", "em andamento")
          .eq("propostas.status", "aceita")
          .order("prazo_entrega", { ascending: true }),
        supabase
          .from("pedidos")
          .select("*")
          .eq("usuario_id", session.user.id)
          .eq("status", "concluído")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("propostas")
          .select("*, pedidos(*)")
          .eq("costureira_id", session.user.id)
          .eq("status", "pendente")
          .order("created_at", { ascending: false }),
      ]);

      if (userData.error) throw userData.error;
      if (activeJobsData.error) throw activeJobsData.error;
      if (completedJobsData.error) throw completedJobsData.error;
      if (pendingProposalsData.error) throw pendingProposalsData.error;

      setUser(userData.data);
      setActiveJobs(activeJobsData.data);
      setCompletedJobs(completedJobsData.data);
      setPendingProposals(pendingProposalsData.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar o dashboard. Por favor, tente novamente mais tarde.",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar_url} alt={user?.nome_completo} />
            <AvatarFallback>
              {user?.nome_completo?.charAt(0) ?? "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Bem-vinda, {user?.nome_completo}
            </h1>
            <p className="text-muted-foreground">Costureira</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => router.push("/costureira/jobs")}>
            <Search className="mr-2 h-4 w-4" /> Procurar Trabalhos
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/costureira/perfil")}
          >
            <User className="mr-2 h-4 w-4" /> Editar Perfil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trabalhos Ativos
            </CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Propostas Pendentes
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingProposals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3.000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliação Média
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Ganhos Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Próximos Prazos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.slice(0, 3)?.map((job) => (
                <div key={job.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{job.tipo_roupa}</p>
                    <p className="text-sm text-muted-foreground">
                      Prazo: {formatDate(job.prazo_entrega)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/costureira/jobs/${job.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Trabalhos Ativos</TabsTrigger>
          <TabsTrigger value="proposals">Propostas Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Trabalhos Concluídos</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid gap-4">
            {activeJobs?.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.tipo_roupa}</CardTitle>
                  <CardDescription>
                    Prazo: {formatDate(job.prazo_entrega)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p>Status: {job.status}</p>
                      <p>Valor: R$ {job.propostas[0].valor.toFixed(2)}</p>
                    </div>
                    <Button
                      onClick={() => router.push(`/costureira/jobs/${job.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="proposals">
          <div className="grid gap-4">
            {pendingProposals?.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  {/* <CardTitle>{proposal.pedido.tipo_roupa}</CardTitle> */}
                  <CardDescription>
                    Enviada em: {formatDate(proposal.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p>Valor Proposto: R$ {proposal.valor.toFixed(2)}</p>
                      <p>
                        Prazo do Cliente:{" "}
                        {/* {formatDate(proposal.pedido.prazo_entrega)} */}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        router.push(`/costureira/proposta/${proposal.id}`)
                      }
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-4">
            {completedJobs?.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.tipo_roupa}</CardTitle>
                  <CardDescription>
                    Concluído em: {formatDate(job.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p>Valor: R$ {job.valor.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/costureira/jobs/${job.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tendências de Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-10 w-10 text-primary" />
            <div>
              <p className="font-medium">Roupas sustentáveis estão em alta</p>
              <p className="text-sm text-muted-foreground">
                Considere oferecer serviços de upcycling e reparos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
