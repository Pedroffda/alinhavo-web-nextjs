import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LinkIcon, PlusCircleIcon, ScissorsIcon, StarIcon } from "lucide-react";
import Link from "next/link";

export default async function AlinhavoCostura() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-12 p-6 border-[#ff9900]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 font-serif">
                Peça sua Roupa Personalizada
              </h2>
              <p className="text-muted-foreground mb-4">
                Crie uma peça única que se ajusta perfeitamente ao seu estilo e
                medidas.
              </p>
            </div>
            <Link href="/criar-pedido">
              <Button className="bg-[#ff9900] text-[#232f3e] hover:bg-[#ffac31]">
                <PlusCircleIcon className="mr-2" />
                Criar Pedido
              </Button>
            </Link>
          </div>
        </Card>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-foreground font-serif">
            Ofertas em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "Vestido Floral",
                price: "R$ 199,99",
                image:
                  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D",
              },
              {
                title: "Camisa Casual",
                price: "R$ 89,99",
                image:
                  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hpcnR8ZW58MHx8MHx8fDA%3D",
              },
              {
                title: "Calça Jeans",
                price: "R$ 149,99",
                image:
                  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8amVhbnN8ZW58MHx8MHx8fDA%3D",
              },
              {
                title: "Blazer Elegante",
                price: "R$ 299,99",
                image:
                  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhemVyfGVufDB8fDB8fHww",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground font-serif">
                    {item.title}
                  </h3>
                  <Badge variant="secondary" className="mb-2">
                    A partir de
                  </Badge>
                  <p className="text-2xl font-bold text-[#B12704]">
                    {item.price}
                  </p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4].map((star) => (
                      <StarIcon
                        key={star}
                        className="h-5 w-5 text-[#ff9900] fill-current"
                      />
                    ))}
                    <StarIcon className="h-5 w-5 text-muted-foreground fill-current" />
                    <span className="ml-2 text-foreground">(15)</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-foreground font-serif">
            Categorias Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "Vestidos",
                image:
                  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D",
              },
              {
                name: "Camisas",
                image:
                  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D",
              },
              {
                name: "Calças",
                image:
                  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFudHN8ZW58MHx8MHx8fDA%3D",
              },
              {
                name: "Saias",
                image:
                  "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpcnR8ZW58MHx8MHx8fDA%3D",
              },
            ].map((category) => (
              <Card
                key={category.name}
                className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-center text-foreground font-serif">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-foreground font-serif">
            Como Funciona o Alinhavo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ScissorsIcon,
                title: "Escolha seu Estilo",
                description:
                  "Navegue por nossas categorias ou crie um pedido personalizado.",
              },
              {
                icon: LinkIcon,
                title: "Conecte-se com Costureiros",
                description:
                  "Receba propostas de costureiros talentosos e escolha o melhor para você.",
              },
              {
                icon: ScissorsIcon,
                title: "Receba sua Peça Única",
                description:
                  "Acompanhe o progresso e receba sua roupa personalizada em casa.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-muted rounded-full p-4 inline-block mb-4">
                  <step.icon className="h-12 w-12 text-[#ff9900]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground font-serif">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground font-serif">
            Costureiros em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Maria Costura",
                specialty: "Especialista em vestidos de festa",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
              },
              {
                name: "João Alfaiate",
                specialty: "Mestre em ternos sob medida",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
              },
              {
                name: "Ana Modista",
                specialty: "Criações exclusivas em alta costura",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
              },
            ].map((costureiro, index) => (
              <Card
                key={index}
                className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <img
                  src={costureiro.image}
                  alt={costureiro.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground font-serif">
                    {costureiro.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {costureiro.specialty}
                  </p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className="h-5 w-5 text-[#ff9900] fill-current"
                      />
                    ))}
                    <span className="ml-2 text-foreground">
                      (32 avaliações)
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#232f3e] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Sobre o Alinhavo",
                items: [
                  "Quem Somos",
                  "Trabalhe Conosco",
                  "Termos de Uso",
                  "Política de Privacidade",
                ],
              },
              {
                title: "Ajuda",
                items: [
                  "Central de Ajuda",
                  "Como Comprar",
                  "Prazo de Entrega",
                  "Trocas e Devoluções",
                ],
              },
              {
                title: "Costure com o Alinhavo",
                items: [
                  "Seja um Costureiro",
                  "Planos e Preços",
                  "Dicas para Vendedores",
                  "Segurança",
                ],
              },
              {
                title: "Redes Sociais",
                items: ["Facebook", "Instagram", "Twitter", "YouTube"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4 font-serif">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Button
                        variant="link"
                        className="text-white hover:text-[#ff9900] p-0"
                      >
                        {item}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>
              &copy; {new Date().getFullYear()} Alinhavo. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
