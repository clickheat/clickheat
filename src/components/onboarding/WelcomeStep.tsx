
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Eye, Zap } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Track Every Click",
      description: "See exactly where your audience clicks with real-time heatmaps"
    },
    {
      icon: <Eye className="h-6 w-6 text-primary" />,
      title: "Visual Analytics",
      description: "Beautiful visualizations that make data insights obvious"
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "AI Optimization",
      description: "Get smart suggestions to boost your link performance"
    }
  ];

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Welcome to ClickHeat!
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          You're about to build the smartest bio link page on the internet. 
          Let's get you set up with heatmap tracking in just a few minutes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 my-12">
        {benefits.map((benefit, index) => (
          <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">{benefit.icon}</div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-8">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span>Free 14-day trial • No credit card required</span>
      </div>

      <Button onClick={onNext} size="lg" className="px-8">
        Let's Build Your Smart Bio Link →
      </Button>
    </div>
  );
};

export default WelcomeStep;
