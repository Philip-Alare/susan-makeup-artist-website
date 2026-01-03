import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Edit, Home, Info, Phone, Package, Palette, Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { withSite } from "@/lib/api";

interface ContentManagerProps {
  onNavigate: (page: string, section?: string) => void;
}

const sections = [
  {
    id: "home",
    title: "Home",
    description: "Hero slides and homepage highlights",
    preview: "Luxury Makeup | BeautyHomeBySuzain",
    icon: Home,
    image: "/assets/IMG-20251227-WA0030.jpg",
  },
  {
    id: "about",
    title: "About",
    description: "Bio, locations, and training info",
    preview: "Susan Eworo (Suzain) - Luxury bridal & glam artist",
    icon: Info,
    image: "/assets/IMG-20251227-WA0018.jpg",
  },
  {
    id: "services",
    title: "Services",
    description: "Bridal, Birthday, Event, and Editorial glam",
    preview: "Flawless makeup for every occasion",
    icon: Palette,
    image: "/assets/IMG-20251227-WA0019.jpg",
  },
  {
    id: "packages",
    title: "Packages",
    description: "Pricing and package details",
    preview: "Bridal, Birthday, and Exclusive Shoot packages",
    icon: Package,
    image: "/assets/IMG-20251227-WA0028.jpg",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Gallery categories and images",
    preview: "Bridal, Birthday, Editorial showcases",
    icon: ImageIcon,
    image: "/assets/IMG-20251227-WA0032.jpg",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Phone, email, social links",
    preview: "+44 7523 992614 | London & UK",
    icon: Phone,
    image: "/assets/IMG-20251227-WA0036.jpg",
  },
];

export default function ContentManager({ onNavigate }: ContentManagerProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} hover>
              <div className="relative h-40 overflow-hidden bg-muted">
                <ImageWithFallback
                  src={withSite(section.image)}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[#C9A24D] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1c1208]" />
                  </div>
                  <h3 className="text-white font-medium">{section.title}</h3>
                </div>
              </div>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                  <div className="p-3 bg-[#fdf7ef] rounded-lg border border-[#d6c4a5]/30">
                    <p className="text-sm text-[#2c1a0a] line-clamp-2">{section.preview}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 bg-[#C9A24D] hover:bg-[#b89342] text-[#1c1208]"
                    onClick={() => onNavigate("editor", section.id)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
