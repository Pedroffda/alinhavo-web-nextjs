import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const offers = [
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
];

export default function FeaturedOffers() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-foreground font-serif">
        Ofertas em Destaque
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {offers.map((item, index) => (
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
              <p className="text-2xl font-bold text-[#B12704]">{item.price}</p>
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
  );
}
