"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScissorsIcon, ShirtIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EscolhaTipoUsuario() {
  const router = useRouter();
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);

  const handleEscolha = (tipo: string) => {
    setTipoSelecionado(tipo);
  };

  const handleContinuar = () => {
    if (tipoSelecionado) {
      router.push(`/registro/${tipoSelecionado}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Crie sua conta no Alinhavo</h1>
        <div className="flex justify-center space-x-4">
          <Card
            className={`w-64 cursor-pointer ${
              tipoSelecionado === "cliente" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleEscolha("cliente")}
          >
            <CardHeader>
              <CardTitle className="text-center">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ShirtIcon className="w-16 h-16 mb-4" />
              <p className="text-center">Procuro roupas personalizadas</p>
            </CardContent>
          </Card>
          <Card
            className={`w-64 cursor-pointer ${
              tipoSelecionado === "costureiro" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleEscolha("costureiro")}
          >
            <CardHeader>
              <CardTitle className="text-center">Costureiro</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ScissorsIcon className="w-16 h-16 mb-4" />
              <p className="text-center">Ofereço serviços de costura</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Button onClick={handleContinuar} disabled={!tipoSelecionado}>
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
