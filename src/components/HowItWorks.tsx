import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import howItWorksImage from "@/assets/how-it-works.jpg";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Sign Up & Customize",
      description: "Create your account in seconds and customize your bio page with our intuitive drag-and-drop builder. Choose from beautiful templates or start from scratch.",
      highlight: "2 minutes setup"
    },
    {
      number: "02", 
      title: "Add Your Links",
      description: "Add unlimited links to your products, social media, content, and more. Organize them with our smart categorization and beautiful icons.",
      highlight: "Unlimited links"
    },
    {
      number: "03",
      title: "Track & Optimize",
      description: "Watch your heatmap light up with real-time clicks. Get AI-powered insights and recommendations to maximize your engagement and conversions.",
      highlight: "Real-time analytics"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            How <span className="bg-gradient-hero bg-clip-text text-transparent">ClickHeat</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get up and running in minutes. Start optimizing your bio links with powerful heatmap analytics today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-heat group-hover:shadow-glow transition-all duration-300">
                    {step.number}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {step.highlight}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Illustration */}
          <div className="relative animate-scale-in">
            <img
              src={howItWorksImage}
              alt="How ClickHeat works step by step"
              className="w-full h-auto rounded-2xl shadow-glow"
            />
            
            {/* Floating stats */}
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-semibold text-heat-intense">247 clicks today</div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-semibold text-heat-warm">89% mobile traffic</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-section rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Ready to see which links perform best?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of creators who've already optimized their bio links with ClickHeat's powerful analytics.
          </p>
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;