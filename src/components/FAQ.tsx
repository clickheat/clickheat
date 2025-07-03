import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How is ClickHeat different from Linktree or other bio link tools?",
      answer: "ClickHeat combines traditional bio link functionality with advanced heatmap analytics and AI-powered optimization. While other tools just show you basic click counts, we show you exactly where people click, when they click, and provide AI suggestions to improve your performance. It's like having a growth hacker built into your bio page."
    },
    {
      question: "Do you track my visitors' personal information?",
      answer: "We prioritize privacy and only collect anonymous analytics data needed for heatmap generation. We don't track personal information, store IP addresses long-term, or sell any data to third parties. All data is GDPR and CCPA compliant, and users can opt out of tracking at any time."
    },
    {
      question: "How quickly can I see results from the heatmap data?",
      answer: "You'll start seeing heatmap data immediately after your first clicks! The real-time nature means you can watch patterns emerge within minutes of publishing your bio page. Most users see actionable insights within 24-48 hours, and significant optimization results within the first week."
    },
    {
      question: "Can I use my own domain name?",
      answer: "Yes! Pro and Business plans include custom domain support. You can use your own domain (like bio.yourname.com) or a subdomain. We provide easy DNS setup instructions and SSL certificates are included automatically."
    },
    {
      question: "What integrations do you support?",
      answer: "We integrate with 50+ platforms including Shopify, Gumroad, Substack, ConvertKit, Mailchimp, YouTube, Instagram, TikTok, Twitter, LinkedIn, Spotify, Apple Podcasts, and many more. We're constantly adding new integrations based on user requests."
    },
    {
      question: "How does the AI optimization work?",
      answer: "Our AI analyzes your heatmap data, click patterns, conversion rates, and compares them with anonymous benchmarks from similar creators. It then provides specific recommendations like optimal link placement, color choices, CTA improvements, and timing suggestions to maximize your engagement."
    },
    {
      question: "Can I A/B test different versions of my bio page?",
      answer: "Absolutely! Pro and Business plans include built-in A/B testing. You can test different layouts, link orders, colors, CTAs, and more. Our system automatically splits your traffic and shows you which version performs better with statistical significance."
    },
    {
      question: "What happens to my data if I cancel my subscription?",
      answer: "You can always export your analytics data and heatmap reports. If you downgrade to the free plan, your bio page stays active but with limited features. If you delete your account, all data is permanently removed within 30 days. You always own your data."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not completely satisfied with ClickHeat within the first 30 days, we'll refund your payment, no questions asked."
    },
    {
      question: "Is there a limit on the number of links I can add?",
      answer: "Free accounts can add up to 5 links. Pro and Business plans include unlimited links. You can organize them into categories, add custom icons, and reorder them anytime with our drag-and-drop interface."
    }
  ];

  return (
    <section className="py-20 bg-gradient-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked <span className="bg-gradient-hero bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about ClickHeat. Can't find what you're looking for? 
            <a href="#contact" className="text-primary hover:underline ml-1">Contact our support team</a>.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-background rounded-lg border border-border/50 hover:border-primary/20 transition-colors px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <div className="bg-background rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you get the most out of ClickHeat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@clickheat.com" 
                className="text-primary hover:underline font-medium"
              >
                support@clickheat.com
              </a>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <a 
                href="#" 
                className="text-primary hover:underline font-medium"
              >
                Live Chat Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;