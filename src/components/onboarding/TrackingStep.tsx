
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Globe, Code } from "lucide-react";
import { toast } from "sonner";

interface TrackingStepProps {
  trackingCode: string;
  onNext: () => void;
}

const TrackingStep = ({ trackingCode, onNext }: TrackingStepProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    toast.success("Tracking code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const hostingOptions = [
    {
      id: "clickheat",
      title: "ClickHeat Hosted Page",
      description: "We'll host your bio page - just share your link",
      icon: <Globe className="h-6 w-6" />,
      badge: "Recommended",
      features: ["Instant setup", "Fast loading", "Built-in analytics"]
    },
    {
      id: "external",
      title: "Embed on Your Site",
      description: "Add tracking to your existing bio page",
      icon: <Code className="h-6 w-6" />,
      features: ["Keep your domain", "Custom styling", "Full control"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Set Up Heatmap Tracking
        </h2>
        <p className="text-lg text-muted-foreground">
          Choose how you'd like to track clicks and display your bio page
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {hostingOptions.map((option) => (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all border-2 hover:border-primary/50 ${
                selectedOption === option.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">{option.icon}</div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                  {option.badge && (
                    <Badge variant="secondary">{option.badge}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{option.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {option.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedOption === "external" && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Tracking Code</CardTitle>
              <p className="text-sm text-muted-foreground">
                Copy this code and paste it into your existing bio page's HTML
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{trackingCode}</pre>
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          disabled={!selectedOption}
          size="lg"
          className="px-8"
        >
          {selectedOption === "clickheat" ? "Create My Page" : "I've Added the Code"} →
        </Button>
      </div>
    </div>
  );
};

export default TrackingStep;
