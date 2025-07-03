import { Card, CardContent } from "@/components/ui/card";
import featuresImage from "@/assets/features-icons.jpg";

const Features = () => {
  const features = [
    {
      title: "Unlimited Custom Links",
      description: "Add unlimited links with drag-and-drop ordering. Customize everything from colors to fonts to match your brand perfectly.",
      icon: "🔗"
    },
    {
      title: "Real-Time Click Heatmaps",
      description: "Visualize exactly where your audience clicks with beautiful, real-time heatmap overlays that show engagement patterns.",
      icon: "🔥"
    },
    {
      title: "AI-Driven Optimization",
      description: "Get intelligent suggestions to boost your traffic. Our AI analyzes your data and recommends the best link placement and content.",
      icon: "🤖"
    },
    {
      title: "A/B Testing Made Simple",
      description: "Test different layouts, colors, and link orders to maximize click performance. See what works best for your audience.",
      icon: "📊"
    },
    {
      title: "Seamless Integrations",
      description: "Connect with Substack, Gumroad, Shopify, Instagram, YouTube, and 50+ other platforms. One link, infinite possibilities.",
      icon: "🔌"
    },
    {
      title: "Advanced Analytics",
      description: "Track clicks, views, conversions, and more. Get detailed insights about your audience's behavior and preferences.",
      icon: "📈"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="bg-gradient-hero bg-clip-text text-transparent">Optimize</span> Your Bio
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Go beyond basic link-in-bio tools. ClickHeat combines beautiful bio pages with powerful analytics 
            to help you understand and grow your audience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-heat transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-4 group-hover:animate-pulse-heat">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature highlight */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-glow">
            <span className="animate-pulse-heat">🚀</span>
            Join 10,000+ creators already using ClickHeat
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;