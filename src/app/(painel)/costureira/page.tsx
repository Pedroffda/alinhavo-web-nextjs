"use client";

import { IPedidos, IUsuarios } from "@/@types/collections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { Eye, Loader2, MessageSquare, Scissors, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CostureiraDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUsuarios>();
  const [activeJobs, setActiveJobs] = useState<IPedidos[]>();
  const [completedJobs, setCompletedJobs] = useState<IPedidos[]>();
  const [availableJobs, setAvailableJobs] = useState<IPedidos[]>();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
          router.push("/login");
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // Fetch active jobs
        const { data: activeJobsData, error: activeJobsError } = await supabase
          .from("pedidos")
          .select("*")
          .eq("costureira_id", session.user.id)
          .not("status", "eq", "completed")
          .order("created_at", { ascending: false });

        if (activeJobsError) throw activeJobsError;
        setActiveJobs(activeJobsData);

        // Fetch completed jobs
        const { data: completedJobsData, error: completedJobsError } =
          await supabase
            .from("pedidos")
            .select("*")
            .eq("costureira_id", session.user.id)
            .eq("status", "completed")
            .order("created_at", { ascending: false })
            .limit(5);

        if (completedJobsError) throw completedJobsError;
        setCompletedJobs(completedJobsData);

        // Fetch available jobs
        const { data: availableJobsData, error: availableJobsError } =
          await supabase
            .from("pedidos")
            .select("*")
            .is("costureira_id", null)
            .order("created_at", { ascending: false })
            .limit(5);

        if (availableJobsError) throw availableJobsError;
        setAvailableJobs(availableJobsData);
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

    loadDashboard();
  }, [router, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
            <AvatarImage
              src={user?.avatar_url ?? undefined}
              alt={user?.nome_completo ?? undefined}
            />
            <AvatarFallback>
              {user?.nome_completo?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Bem-vinda, {user?.nome_completo}
            </h1>
            <p className="text-muted-foreground">Costureira</p>
          </div>
        </div>
        <Button onClick={() => router.push("/costureira/jobs")}>
          Procurar Novos Trabalhos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trabalhos Ativos
            </CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeJobs?.length ?? undefined}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mensagens Não Lidas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
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

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Trabalhos Ativos</TabsTrigger>
          <TabsTrigger value="completed">Trabalhos Concluídos</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid gap-4">
            {activeJobs?.map((job: IPedidos) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.tipo_roupa}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Status: {job.status}</p>
                  <p>
                    {/* Prazo: {new Date(job.prazo_entrega).toLocaleDateString()} */}
                    {/* prazo da entrega vai ser a data da criação + dias do prazo de entrega */}
                    Prazo:{" "}
                    {formatDate(
                      job.prazo_entrega + "T00:00:00.000Z" + job.created_at
                    )}
                  </p>
                  <Button
                    className="mt-2"
                    onClick={() => router.push(`/costureira/job/${job.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-4">
            {completedJobs?.map((job: IPedidos) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.tipo_roupa}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Concluído em:{" "}
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                  <Button
                    className="mt-2"
                    onClick={() => router.push(`/costureira/jobs/${job.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Trabalhos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableJobs?.map((job) => (
              <div key={job.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{job.tipo_roupa}</p>
                  <p className="text-sm text-muted-foreground">
                    Prazo:{" "}
                    {formatDate(
                      job.prazo_entrega + "T00:00:00.000Z" + job.created_at
                    )}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/costureira/jobs/${job.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
