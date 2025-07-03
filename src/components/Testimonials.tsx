import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      handle: "@sarahcreates",
      role: "Content Creator",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
      content: "ClickHeat completely transformed how I understand my audience. The heatmaps showed me that my newsletter signup link was being ignored at the bottom. I moved it up and got 340% more subscribers!",
      rating: 5,
      metric: "+340% subscribers"
    },
    {
      name: "Marcus Rodriguez",
      handle: "@marcustech",
      role: "Tech Influencer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "As someone who A/B tests everything, ClickHeat is a game-changer. The AI suggestions are spot-on, and I've increased my course sales by 180% just by optimizing my link placement.",
      rating: 5,
      metric: "+180% course sales"
    },
    {
      name: "Elena Vasquez",
      handle: "@elenadesigns",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "The real-time analytics are incredible. I can see exactly when my Instagram stories drive traffic and which CTAs work best. It's like having a personal growth hacker for my bio.",
      rating: 5,
      metric: "+250% click-through rate"
    },
    {
      name: "James Park",
      handle: "@jamescooks",
      role: "Food Blogger",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "I was skeptical about another link-in-bio tool, but the heatmap feature sold me. Now I know exactly which recipes my followers want, and my blog traffic is up 200%.",
      rating: 5,
      metric: "+200% blog traffic"
    },
    {
      name: "Rachel Thompson",
      handle: "@rachelfitness",
      role: "Fitness Coach",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      content: "ClickHeat's A/B testing helped me optimize my coaching program signup page. The insights are actionable and the interface is so clean. Best investment I've made for my business.",
      rating: 5,
      metric: "+150% program signups"
    },
    {
      name: "David Kumar",
      handle: "@davidpodcasts",
      role: "Podcaster",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      content: "The integration with my podcast hosting platform is seamless. I can track which episodes get the most interest and adjust my content strategy accordingly. Brilliant tool!",
      rating: 5,
      metric: "+300% episode engagement"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Loved by <span className="bg-gradient-hero bg-clip-text text-transparent">10,000+</span> Creators
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how ClickHeat is helping creators, influencers, and businesses optimize their bio links and grow their audience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group hover:shadow-heat transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
            >
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-heat-warm text-heat-warm" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Metric highlight */}
                <div className="bg-gradient-section rounded-lg p-3 mb-4">
                  <div className="text-sm font-semibold text-primary">
                    {testimonial.metric}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.handle}</div>
                    <div className="text-xs text-heat-medium">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social proof numbers */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              10,000+
            </div>
            <div className="text-sm text-muted-foreground">Happy Creators</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              50M+
            </div>
            <div className="text-sm text-muted-foreground">Links Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              250%
            </div>
            <div className="text-sm text-muted-foreground">Avg. CTR Increase</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              99.9%
            </div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;