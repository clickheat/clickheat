
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, BarChart3, Eye, Zap } from "lucide-react";

interface SuccessStepProps {
  onComplete: () => void;
}

const SuccessStep = ({ onComplete }: SuccessStepProps) => {
  const nextSteps = [
    {
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
      title: "View Your Dashboard",
      description: "Monitor clicks and performance in real-time"
    },
    {
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      title: "Explore Heatmaps",
      description: "See visual click patterns as data comes in"
    },
    {
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      title: "Get AI Insights",
      description: "Receive smart suggestions to optimize your links"
    }
  ];

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="text-6xl mb-4">🎉</div>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-4xl font-bold text-foreground mb-4">
          You're All Set!
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your smart bio page is live and tracking is active. 
          Click data will start appearing in your dashboard within minutes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 my-12">
        {nextSteps.map((step, index) => (
          <Card key={index} className="border-2">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Button onClick={onComplete} size="lg" className="px-8">
          Go to Dashboard →
        </Button>
        <p className="text-sm text-muted-foreground">
          Your heatmap data will appear once people start clicking your links
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;
