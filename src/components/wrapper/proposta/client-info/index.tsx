import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ClientInfoProps = {
  nome: string;
  avatarUrl: string;
};

export function ClientInfo({ nome, avatarUrl }: Readonly<ClientInfoProps>) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{nome.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{nome}</p>
            <p className="text-sm text-muted-foreground">Cliente</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
