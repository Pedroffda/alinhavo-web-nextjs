"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProgress() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jobTitle, setJobTitle] = useState<string | null>("");
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    loadProposalProgress();
  }, []);

  async function loadProposalProgress() {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) {
        router.push("/entrar");
        return;
      }

      const userId = sessionData.session.user.id;

      const { data, error } = await supabase
        .from("propostas")
        .select(
          `
          progresso,
          pedidos (tipo_roupa)
        `
        )
        .eq("pedido_id", params.id)
        .eq("costureira_id", userId)
        .single();

      if (error) throw error;

      setProgress(data.progresso);
      setJobTitle(data.pedidos?.[0]?.tipo_roupa as string);
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar o progresso. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
  };

  const handleProgressUpdate = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("propostas")
        .update({ progresso: progress })
        .eq("pedido_id", params.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Progresso atualizado com sucesso!",
      });
      router.push(`/costureira/jobs/${params.id}`);
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível atualizar o progresso. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
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
      <Card>
        <CardHeader>
          <CardTitle>Atualizar Progresso - {jobTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={1}
                className="flex-grow"
              />
              <Input
                type="number"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-20"
                min={0}
                max={100}
              />
              <span>%</span>
            </div>
            <Button
              onClick={handleProgressUpdate}
              disabled={updating}
              className="w-full"
            >
              {updating ? "Atualizando..." : "Atualizar Progresso"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
