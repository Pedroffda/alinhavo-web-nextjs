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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CriarPedidoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tipoRoupa: "",
    tamanho: "",
    cor: "",
    material: "",
    estilo: "",
    detalhes: "",
    prazoEntrega: 14,
    orcamentoMaximo: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para criar um pedido.",
          variant: "destructive",
        });
      }
    };
    checkAuth();
  }, [supabase, router, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]); // Seleciona apenas a primeira imagem
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: orderData, error: orderError } = await supabase
        .from("pedidos")
        .insert([{ ...formData, usuario_id: user.id }])
        .select();

      if (orderError) throw orderError;

      if (image && orderData) {
        const orderId = orderData[0].id;
        const fileExt = image.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${orderId}/${fileName}`;

        // Upload da imagem
        const { error: uploadError } = await supabase.storage
          .from("inspiracoes")
          .upload(filePath, image);

        console.log("uploadError", uploadError);

        if (uploadError) throw uploadError;

        const { error: insertError } = await supabase
          .from("inspiracoes")
          .insert({
            pedido_id: orderId,
            nome_arquivo: image.name,
            caminho_storage: filePath,
            tamanho_bytes: image.size,
            tipo_mime: image.type,
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Pedido criado com sucesso!",
        description: "Seu pedido foi enviado e será analisado em breve.",
      });

      router.push("/meus-pedidos");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast({
        title: "Erro ao criar pedido",
        description:
          "Ocorreu um erro ao criar seu pedido. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Criar Novo Pedido
          </CardTitle>
          <CardDescription className="text-center">
            Preencha os detalhes do seu pedido personalizado
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoRoupa">Tipo de Roupa</Label>
                <Select
                  name="tipoRoupa"
                  onValueChange={(value) =>
                    handleSelectChange("tipoRoupa", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vestido">Vestido</SelectItem>
                    <SelectItem value="camisa">Camisa</SelectItem>
                    <SelectItem value="calca">Calça</SelectItem>
                    <SelectItem value="saia">Saia</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tamanho">Tamanho</Label>
                <Select
                  name="tamanho"
                  onValueChange={(value) =>
                    handleSelectChange("tamanho", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PP">PP</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="GG">GG</SelectItem>
                    <SelectItem value="sob_medida">Sob Medida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cor">Cor Principal</Label>
              <Input
                type="text"
                id="cor"
                name="cor"
                placeholder="Ex: Azul marinho, Vermelho escuro"
                value={formData.cor}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Material Preferido</Label>
              <Input
                type="text"
                id="material"
                name="material"
                placeholder="Ex: Algodão, Seda, Linho"
                value={formData.material}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estilo">Estilo</Label>
              <RadioGroup
                name="estilo"
                onValueChange={(value) => handleSelectChange("estilo", value)}
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casual" id="casual" />
                  <Label htmlFor="casual">Casual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="formal" id="formal" />
                  <Label htmlFor="formal">Formal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="esportivo" id="esportivo" />
                  <Label htmlFor="esportivo">Esportivo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="festa" id="festa" />
                  <Label htmlFor="festa">Festa</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalhes">Detalhes Adicionais</Label>
              <Textarea
                id="detalhes"
                name="detalhes"
                placeholder="Descreva detalhes específicos, medidas ou referências de estilo"
                value={formData.detalhes}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazoEntrega">
                Prazo de Entrega Desejado (em dias)
              </Label>
              <Slider
                id="prazoEntrega"
                min={7}
                max={60}
                step={1}
                value={[formData.prazoEntrega]}
                onValueChange={(value) =>
                  handleSliderChange("prazoEntrega", value)
                }
              />
              <div className="text-center">{formData.prazoEntrega} dias</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orcamentoMaximo">Orçamento Máximo (R$)</Label>
              <Input
                type="number"
                id="orcamentoMaximo"
                name="orcamentoMaximo"
                placeholder="Valor em Reais"
                value={formData.orcamentoMaximo}
                onChange={handleInputChange}
                min="0"
                step="10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imagens">Imagens de Inspiração</Label>
              <Input
                type="file"
                id="imagens"
                name="imagens"
                onChange={handleImageUpload}
                multiple
                accept="image/*"
              />
              <p className="text-sm text-gray-500">
                Você pode selecionar múltiplas imagens
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando Pedido..." : "Criar Pedido"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
