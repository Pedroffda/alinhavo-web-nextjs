import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";

type JobHeaderProps = {
  tipoRoupa: string;
  clienteNome: string;
  status: string;
};

export function JobHeader({
  tipoRoupa,
  clienteNome,
  status,
}: Readonly<JobHeaderProps>) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-500";
      case "em andamento":
        return "bg-blue-500";
      case "concluído":
        return "bg-green-500";
      case "cancelado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="text-3xl mb-2">{tipoRoupa}</CardTitle>
        <CardDescription>Publicado por {clienteNome}</CardDescription>
      </div>
      <Badge className={getStatusColor(status)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    </div>
  );
}
