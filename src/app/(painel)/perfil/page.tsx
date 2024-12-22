"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const userSchema = z.object({
  email: z.string().email(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function MeuPerfil() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);

        if (!(await supabase.auth.getSession()))
          throw new Error("Usuário não autenticado");

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (!user) throw new Error("Usuário não encontrado");

        setValue("email", user.email ?? "");
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        toast({
          title: "Erro",
          description:
            "Não foi possível carregar seus dados. Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [setValue, supabase.auth]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setUpdating(true);
      if (!(await supabase.auth.getSession()).data)
        throw new Error("Usuário não autenticado");

      const { error } = await supabase.auth.updateUser({
        data: {
          email: data.email,
        },
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Seus dados foram atualizados com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível atualizar seus dados. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Email</Label>
              <Input id="full_name" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Atualizando...
                </>
              ) : (
                "Atualizar Perfil"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
