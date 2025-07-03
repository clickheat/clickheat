import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 custom links",
        "Basic analytics",
        "ClickHeat subdomain",
        "Standard templates",
        "Email support"
      ],
      cta: "Start Free",
      popular: false,
      variant: "outline" as const
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month", 
      description: "For serious creators",
      features: [
        "Unlimited links",
        "Real-time heatmaps",
        "AI optimization assistant",
        "A/B testing",
        "Custom domain",
        "Advanced analytics",
        "Priority support",
        "Custom themes"
      ],
      cta: "Start Free Trial",
      popular: true,
      variant: "hero" as const
    },
    {
      name: "Business",
      price: "$29",
      period: "per month",
      description: "For teams and agencies",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "White-label branding",
        "API access",
        "Custom integrations",
        "Advanced A/B testing",
        "Dedicated support",
        "Custom analytics"
      ],
      cta: "Start Free Trial",
      popular: false,
      variant: "outline" as const
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent <span className="bg-gradient-hero bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready. All plans include our core heatmap analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary shadow-heat scale-105' 
                  : 'border-border hover:border-primary/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-glow">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant={plan.variant} className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="text-2xl">💰</span>
            <span>30-day money-back guarantee on all paid plans</span>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center bg-background rounded-2xl p-8 border border-border">
          <h3 className="text-xl font-semibold mb-2">Need something custom?</h3>
          <p className="text-muted-foreground mb-4">
            Enterprise plans with custom features, dedicated support, and SLA agreements.
          </p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;