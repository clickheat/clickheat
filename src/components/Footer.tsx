import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Pricing", href: "#pricing" },
        { name: "Integrations", href: "#integrations" },
        { name: "API", href: "#api" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Blog", href: "#blog" },
        { name: "Careers", href: "#careers" },
        { name: "Press Kit", href: "#press" },
        { name: "Contact", href: "#contact" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Documentation", href: "#docs" },
        { name: "Community", href: "#community" },
        { name: "Status", href: "#status" },
        { name: "Bug Reports", href: "#bugs" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
        { name: "GDPR", href: "#gdpr" },
        { name: "Security", href: "#security" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: "🐦" },
    { name: "Instagram", href: "#", icon: "📸" },
    { name: "LinkedIn", href: "#", icon: "💼" },
    { name: "YouTube", href: "#", icon: "📺" },
    { name: "Discord", href: "#", icon: "💬" }
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated with <span className="bg-gradient-hero bg-clip-text text-transparent">ClickHeat</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Get the latest tips, trends, and features delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button variant="hero">Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-hero p-2 rounded-lg">
                  <span className="text-primary-foreground font-bold text-xl">🔥</span>
                </div>
                <span className="ml-2 text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  ClickHeat
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                The smarter link-in-bio platform with real-time heatmaps and AI-powered optimization. 
                Turn your followers into customers.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-secondary hover:bg-gradient-hero rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-heat group"
                    aria-label={social.name}
                  >
                    <span className="text-lg group-hover:animate-pulse-heat">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 ClickHeat. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-heat"></span>
                All systems operational
              </div>
              <div>
                Made with ❤️ for creators
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;