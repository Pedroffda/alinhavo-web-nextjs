import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const tailors = [
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
];

export default function FeaturedTailors() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-foreground font-serif">
        Costureiros em Destaque
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tailors.map((tailor, index) => (
          <Card
            key={index}
            className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <img
              src={tailor.image}
              alt={tailor.name}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 text-foreground font-serif">
                {tailor.name}
              </h3>
              <p className="text-muted-foreground mb-2">{tailor.specialty}</p>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className="h-5 w-5 text-[#ff9900] fill-current"
                  />
                ))}
                <span className="ml-2 text-foreground">(32 avaliações)</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
