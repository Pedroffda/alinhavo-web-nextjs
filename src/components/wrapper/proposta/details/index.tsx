import { Calendar, DollarSign } from "lucide-react";

type JobDetailsProps = {
  prazoEntrega: string;
  orcamentoMaximo: number;
  descricao: string;
  detalhesAdicionais: string;
};

export function JobDetails({
  prazoEntrega,
  orcamentoMaximo,
  descricao,
  detalhesAdicionais,
}: Readonly<JobDetailsProps>) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span>Prazo: {formatDate(prazoEntrega)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <span>Orçamento máximo: R$ {orcamentoMaximo.toFixed(2)}</span>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Descrição do Trabalho</h3>
        <p className="text-muted-foreground">{descricao}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Detalhes Adicionais</h3>
        <p className="text-muted-foreground">
          {detalhesAdicionais || "Nenhum detalhe adicional fornecido."}
        </p>
      </div>
    </>
  );
}
