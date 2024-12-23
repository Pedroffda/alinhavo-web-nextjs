import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type NewProposalFormProps = {
  onSubmit: (proposal: {
    valor: number;
    descricao: string;
    tempo_estimado: number;
  }) => void;
};

export function NewProposalForm({ onSubmit }: Readonly<NewProposalFormProps>) {
  const [newProposal, setNewProposal] = useState({
    valor: 0,
    descricao: "",
    tempo_estimado: 0,
  });

  const handleSubmit = () => {
    onSubmit(newProposal);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Proposta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="valor"
              className="block text-sm font-medium text-gray-700"
            >
              Valor Proposto (R$)
            </label>
            <Input
              type="number"
              id="valor"
              value={newProposal.valor}
              onChange={(e) =>
                setNewProposal({
                  ...newProposal,
                  valor: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label
              htmlFor="tempo"
              className="block text-sm font-medium text-gray-700"
            >
              Tempo Estimado (horas)
            </label>
            <Input
              type="number"
              id="tempo"
              value={newProposal.tempo_estimado}
              onChange={(e) =>
                setNewProposal({
                  ...newProposal,
                  tempo_estimado: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700"
            >
              Descrição da Proposta
            </label>
            <Textarea
              id="descricao"
              value={newProposal.descricao}
              onChange={(e) =>
                setNewProposal({ ...newProposal, descricao: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Enviar Proposta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
