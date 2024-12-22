"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const userSchema = z.object({
  nome_completo: z.string().min(1, "Nome completo é obrigatório"),
  nome_usuario: z
    .string()
    .min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  biografia: z.string().optional(),
  tipo_usuario: z.enum(["normal", "costureiro"]),
  especialidades: z.string().optional(),
  anos_experiencia: z.string().optional(),
  // avatar_url: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function EditarPerfil() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  // const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const tipoUsuario = watch("tipo_usuario");
  // const avatarUrl = watch("avatar_url");

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) throw new Error("Usuário não autenticado");

        const { data: user, error: userError } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userError) throw userError;
        if (!user) throw new Error("Usuário não encontrado");

        Object.keys(user).forEach((key) => {
          if (key in userSchema.shape) {
            setValue(key as keyof UserFormValues, user[key]);
          }
        });
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
  }, [setValue, toast]);

  const onSubmit = async (data: UserFormValues) => {
    // console.log(data);
    try {
      setUpdating(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("Usuário não autenticado");

      // if (avatarFile) {
      //   const { data: uploadData, error: uploadError } = await supabase.storage
      //     .from("avatars")
      //     .upload(`${session.user.id}/${avatarFile.name}`, avatarFile);

      //   if (uploadError) throw uploadError;

      // const {
      //   data: { publicUrl },
      // } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

      // data.avatar_url = publicUrl;
      // }

      const { error } = await supabase
        .from("usuarios")
        .update({
          ...data,
          especialidades: data.especialidades
            ? data.especialidades.split(",").map((e) => e.trim())
            : null,
          anos_experiencia: data.anos_experiencia
            ? parseInt(data.anos_experiencia)
            : null,
        })
        .eq("id", session.user.id);

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

  // const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setAvatarFile(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       // setValue("avatar_url", reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                {/* <AvatarImage src={avatarUrl} alt="Avatar" /> */}
                <AvatarFallback>
                  {watch("nome_completo")?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                    <Upload className="h-4 w-4" />
                    <span>Alterar foto</span>
                  </div>
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  // onChange={handleAvatarChange}
                />
              </div>
            </div>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4">
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
                  <Label htmlFor="nome_usuario">Nome de Usuário</Label>
                  <Input id="nome_usuario" {...register("nome_usuario")} />
                  {errors.nome_usuario && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nome_usuario.message}
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
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" {...register("telefone")} />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.telefone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="biografia">Biografia</Label>
                  <Textarea id="biografia" {...register("biografia")} />
                  {errors.biografia && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.biografia.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="tipo_usuario">Tipo de Usuário</Label>
                  <Controller
                    name="tipo_usuario"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="costureiro">Costureiro</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tipo_usuario && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tipo_usuario.message}
                    </p>
                  )}
                </div>
                {tipoUsuario === "costureiro" && (
                  <>
                    <div>
                      <Label htmlFor="especialidades">
                        Especialidades (separadas por vírgula)
                      </Label>
                      <Input
                        id="especialidades"
                        {...register("especialidades")}
                      />
                      {errors.especialidades && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.especialidades.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="anos_experiencia">
                        Anos de Experiência
                      </Label>
                      <Input
                        id="anos_experiencia"
                        type="number"
                        {...register("anos_experiencia")}
                      />
                      {errors.anos_experiencia && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.anos_experiencia.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
              <TabsContent value="address" className="space-y-4">
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" {...register("endereco")} />
                  {errors.endereco && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endereco.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" {...register("cidade")} />
                  {errors.cidade && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cidade.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input id="estado" {...register("estado")} />
                  {errors.estado && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.estado.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" {...register("cep")} />
                  {errors.cep && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cep.message}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
