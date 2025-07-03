import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                ClickHeat
              </span>
              <br />
              <span className="text-foreground">
                The Smarter Link-in-Bio with Real-Time Heatmaps
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              See exactly which links get clicked the most — optimize your bio like a pro. 
              Turn your followers into customers with AI-powered insights and beautiful bio pages.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
              <Button variant="transparent" size="lg" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo Video
              </Button>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              ✨ No credit card required • 📊 Free forever plan • 🚀 Setup in 2 minutes
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative">
              <img
                src={heroImage}
                alt="ClickHeat bio page with heatmap overlay"
                className="w-full h-auto rounded-2xl shadow-glow"
              />
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-heat-intense text-primary-foreground px-4 py-2 rounded-full font-semibold shadow-lg animate-pulse-heat">
                +247% Clicks
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-background border border-border rounded-lg p-4 shadow-lg">
                <div className="text-sm font-semibold text-foreground">Live Analytics</div>
                <div className="text-xs text-muted-foreground">Real-time insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-heat-warm/10 rounded-full blur-3xl animate-pulse-heat"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-heat-intense/10 rounded-full blur-3xl animate-pulse-heat" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  );
};

export default Hero;