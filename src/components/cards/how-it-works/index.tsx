import { LinkIcon, ScissorsIcon } from "lucide-react";

const steps = [
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
];

export default function HowItWorks() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-foreground font-serif">
        Como Funciona o Alinhavo
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
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
  );
}
