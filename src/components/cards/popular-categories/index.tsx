import { Card, CardContent } from "@/components/ui/card";

const categories = [
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
];

export default function PopularCategories() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-foreground font-serif">
        Categorias Populares
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
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
  );
}
