import { Button } from "@/components/ui/button";

const footerSections = [
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
];

export default function Footer() {
  return (
    <footer className="bg-[#232f3e] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
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
  );
}
