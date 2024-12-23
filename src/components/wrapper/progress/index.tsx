"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";

type ProgressUpdateProps = {
  proposalId: number;
  currentProgress: number;
  onProgressUpdate: (newProgress: number) => void;
};

export function ProgressUpdate({
  proposalId,
  currentProgress,
  onProgressUpdate,
}: Readonly<ProgressUpdateProps>) {
  const [progress, setProgress] = useState(currentProgress);
  const [updating, setUpdating] = useState(false);

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
  };

  const handleProgressUpdate = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("propostas")
        .update({ progresso: progress })
        .eq("id", proposalId);

      if (error) throw error;

      onProgressUpdate(progress);
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
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atualizar Progresso</CardTitle>
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
          <Button onClick={handleProgressUpdate} disabled={updating}>
            {updating ? "Atualizando..." : "Atualizar Progresso"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
