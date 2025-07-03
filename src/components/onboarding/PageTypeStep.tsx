
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Youtube, Instagram, ShoppingBag, Palette } from "lucide-react";

interface PageTypeStepProps {
  onNext: (pageType: string) => void;
}

const PageTypeStep = ({ onNext }: PageTypeStepProps) => {
  const [selectedType, setSelectedType] = useState<string>("");

  const pageTypes = [
    {
      id: "creator",
      title: "Creator Page",
      description: "Perfect for YouTubers, Instagramers, and content creators",
      icon: <Youtube className="h-8 w-8" />,
      features: ["Social media links", "Content showcase", "Creator-focused layout"]
    },
    {
      id: "business",
      title: "Business/Shop",
      description: "Ideal for businesses, shops, and online stores",
      icon: <ShoppingBag className="h-8 w-8" />,
      features: ["Product links", "Store integration", "Business-focused design"]
    },
    {
      id: "custom",
      title: "Custom Layout",
      description: "Build something unique with complete customization",
      icon: <Palette className="h-8 w-8" />,
      features: ["Full customization", "Advanced styling", "Unlimited flexibility"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What type of page are you building?
        </h2>
        <p className="text-lg text-muted-foreground">
          This helps us customize your experience and suggest the best layout
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {pageTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all border-2 hover:border-primary/50 ${
              selectedType === type.id ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center text-primary">
                {type.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
              <p className="text-muted-foreground mb-4">{type.description}</p>
              <ul className="text-sm space-y-1">
                {type.features.map((feature, index) => (
                  <li key={index} className="text-muted-foreground">
                    • {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => selectedType && onNext(selectedType)}
          disabled={!selectedType}
          size="lg"
          className="px-8"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default PageTypeStep;
