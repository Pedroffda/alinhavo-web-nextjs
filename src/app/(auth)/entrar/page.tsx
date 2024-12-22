"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { ScissorsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao Alinhavo!",
      });
      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/registro"); // Redireciona para a página de escolha de tipo de usuário
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <ScissorsIcon className="h-12 w-12 text-[#ff9900]" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Entrar no Alinhavo
          </CardTitle>
          <CardDescription className="text-center">
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?
              <Button
                variant="link"
                className="pl-1 underline"
                onClick={handleRegisterRedirect}
              >
                Criar conta
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
