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
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CriarPedidoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tipo_roupa: "",
    tamanho: "",
    cor: "",
    material: "",
    estilo: "",
    detalhes_adicionais: "",
    prazo_entrega: 14,
    orcamento_maximo: 0,
    status: "pending",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());

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
        router.push("/login");
      }
    };
    checkAuth();
  }, [router, toast]);

  useEffect(() => {
    const newDeliveryDate = new Date();
    newDeliveryDate.setDate(newDeliveryDate.getDate() + formData.prazo_entrega);
    setDeliveryDate(newDeliveryDate);
  }, [formData.prazo_entrega]);

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
      setImage(e.target.files[0]);
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
        .insert([
          {
            ...formData,
            usuario_id: user.id,
            prazo_entrega: deliveryDate.toISOString().split("T")[0],
          },
        ])
        .select();

      if (orderError) throw orderError;

      if (image && orderData) {
        const orderId = orderData[0].id;
        const fileExt = image.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${orderId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("inspiracoes")
          .upload(filePath, image);

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

      router.push("/cliente/meus-pedidos");
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
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Criar Novo Pedido
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Preencha os detalhes do seu pedido personalizado
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tipo_roupa">Tipo de Roupa</Label>
                <Select
                  name="tipo_roupa"
                  onValueChange={(value) =>
                    handleSelectChange("tipo_roupa", value)
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="estilo">Estilo</Label>
              <RadioGroup
                name="estilo"
                onValueChange={(value) => handleSelectChange("estilo", value)}
                required
                className="flex space-x-4"
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
              <Label htmlFor="detalhes_adicionais">Detalhes Adicionais</Label>
              <Textarea
                id="detalhes_adicionais"
                name="detalhes_adicionais"
                placeholder="Descreva detalhes adicionais específicos, medidas ou referências de estilo"
                value={formData.detalhes_adicionais}
                onChange={handleInputChange}
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazo_entrega">Prazo de Entrega Desejado</Label>
              <Slider
                id="prazo_entrega"
                min={7}
                max={60}
                step={1}
                value={[formData.prazo_entrega]}
                onValueChange={(value) =>
                  handleSliderChange("prazo_entrega", value)
                }
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formData.prazo_entrega} dias</span>
                <span>
                  Data de entrega: {deliveryDate.toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orcamento_maximo">Orçamento Máximo (R$)</Label>
              <Input
                type="number"
                id="orcamento_maximo"
                name="orcamento_maximo"
                placeholder="Valor em Reais"
                value={formData.orcamento_maximo}
                onChange={handleInputChange}
                min="0"
                step="10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imagens">Imagem de Inspiração</Label>
              <Input
                type="file"
                id="imagens"
                name="imagens"
                onChange={handleImageUpload}
                accept="image/*"
              />
              <p className="text-sm text-muted-foreground">
                Você pode selecionar uma imagem de inspiração
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
