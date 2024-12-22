"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const clienteSchema = z
  .object({
    nome_completo: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmar_senha: z.string(),
  })
  .refine((data) => data.senha === data.confirmar_senha, {
    message: "As senhas não coincidem",
    path: ["confirmar_senha"],
  });

type ClienteFormValues = z.infer<typeof clienteSchema>;

export default function RegistroCliente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
  });

  const onSubmit = async (data: ClienteFormValues) => {
    try {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
      });

      if (authError) throw authError;

      console.log(authData);

      if (authData.user) {
        const { error: profileError } = await supabase.from("usuarios").insert({
          id: authData.user.id,
          email: data.email,
          nome_completo: data.nome_completo,
          tipo_usuario: "normal",
        });

        if (profileError) throw profileError;

        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao Alinhavo. Faça login para começar.",
        });
        router.push("/entrar");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      if (
        error instanceof Error &&
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        toast({
          title: "Erro no registro",
          description: "Email já cadastrado. Faça login ou use outro email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro no registro",
          description:
            "Ocorreu um erro ao criar sua conta. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Registro de Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nome_completo">Nome Completo</Label>
              <Input id="nome_completo" {...register("nome_completo")} />
              {errors.nome_completo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nome_completo.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" {...register("senha")} />
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senha.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmar_senha">Confirmar Senha</Label>
              <Input
                id="confirmar_senha"
                type="password"
                {...register("confirmar_senha")}
              />
              {errors.confirmar_senha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmar_senha.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
