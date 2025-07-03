import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Youtube, ShoppingBag, Palette, CheckCircle } from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { toast } from "sonner";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
}

const OnboardingModal = ({ isOpen, onClose, userId }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [pageType, setPageType] = useState("");
  const [links, setLinks] = useState<Link[]>([{ id: "1", title: "", url: "" }]);
  const [bioPageTitle, setBioPageTitle] = useState("My Bio Page");
  const [bioPageDescription, setBioPageDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateData, insertData } = useRealTimeData(userId);
  const totalSteps = 4;

  const pageTypes = [
    {
      id: "creator",
      title: "Creator Page",
      description: "Perfect for YouTubers, Instagramers, and content creators",
      icon: <Youtube className="h-8 w-8" />,
      features: ["Social media links", "Content showcase", "Creator-focused layout"]
    },
    {
      id: "business",
      title: "Business/Shop",
      description: "Ideal for businesses, shops, and online stores",
      icon: <ShoppingBag className="h-8 w-8" />,
      features: ["Product links", "Store integration", "Business-focused design"]
    },
    {
      id: "custom",
      title: "Custom Layout",
      description: "Build something unique with complete customization",
      icon: <Palette className="h-8 w-8" />,
      features: ["Full customization", "Advanced styling", "Unlimited flexibility"]
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: "", url: "" }]);
  };

  const removeLink = (id: string) => {
    if (links.length > 1) {
      setLinks(links.filter(link => link.id !== id));
    }
  };

  const updateLink = (id: string, field: 'title' | 'url', value: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Update profile with page type and completion status
      await updateData('profiles', userId, {
        page_type: pageType,
        onboarding_completed: true,
        onboarding_step: totalSteps
      });

      // Create bio page
      const bioPage = await insertData('bio_pages', {
        user_id: userId,
        title: bioPageTitle,
        description: bioPageDescription,
        is_published: true,
        theme: 'default'
      });

      if (bioPage) {
        // Add links
        const validLinks = links.filter(link => link.title && link.url);
        for (let i = 0; i < validLinks.length; i++) {
          const link = validLinks[i];
          await insertData('links', {
            bio_page_id: bioPage.id,
            title: link.title,
            url: link.url,
            position: i,
            is_active: true
          });
        }
      }

      toast.success("Onboarding completed! Welcome to ClickHeat!");
      onClose();
    } catch (error) {
      toast.error("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / totalSteps) * 100;
  const hasValidLinks = links.some(link => link.title && link.url);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-hero p-3 rounded-xl">
                <span className="text-primary-foreground font-bold text-2xl">🔥</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              Welcome to ClickHeat
            </h1>
            <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="w-full" />

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Let's get you started!</h2>
                  <p className="text-muted-foreground mb-6">
                    We'll help you create a smart bio page with real-time heatmap tracking in just a few steps.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: "📊", title: "Track Every Click", desc: "See exactly where your audience clicks" },
                    { icon: "👁️", title: "Visual Analytics", desc: "Beautiful heatmap visualizations" },
                    { icon: "⚡", title: "AI Optimization", desc: "Smart suggestions to boost performance" }
                  ].map((benefit, index) => (
                    <Card key={index} className="text-center p-4">
                      <div className="text-3xl mb-2">{benefit.icon}</div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">What type of page are you building?</h2>
                  <p className="text-muted-foreground">This helps us customize your experience</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {pageTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all border-2 hover:border-primary/50 ${
                        pageType === type.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setPageType(type.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="mb-3 flex justify-center text-primary">
                          {type.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{type.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                        <ul className="text-xs space-y-1">
                          {type.features.map((feature, index) => (
                            <li key={index} className="text-muted-foreground">• {feature}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Add your first links</h2>
                  <p className="text-muted-foreground">Start with your most important links</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bioTitle">Bio Page Title</Label>
                      <Input
                        id="bioTitle"
                        value={bioPageTitle}
                        onChange={(e) => setBioPageTitle(e.target.value)}
                        placeholder="My Bio Page"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bioDescription">Description</Label>
                      <Input
                        id="bioDescription"
                        value={bioPageDescription}
                        onChange={(e) => setBioPageDescription(e.target.value)}
                        placeholder="Creator & Entrepreneur"
                      />
                    </div>
                  </div>

                  {links.map((link, index) => (
                    <Card key={link.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg mt-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label>Link Title</Label>
                            <Input
                              placeholder="e.g., My YouTube Channel"
                              value={link.title}
                              onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>URL</Label>
                            <Input
                              type="url"
                              placeholder="https://..."
                              value={link.url}
                              onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                            />
                          </div>
                        </div>

                        {links.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLink(link.id)}
                            className="text-red-500 hover:text-red-700 mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={addLink} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Link
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎉</div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4">You're all set!</h2>
                <p className="text-muted-foreground mb-6">
                  Your smart bio page is ready! Real-time tracking will start immediately.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: "📊", title: "View Dashboard", desc: "Monitor clicks in real-time" },
                    { icon: "🔥", title: "Explore Heatmaps", desc: "See visual click patterns" },
                    { icon: "🤖", title: "Get AI Insights", desc: "Receive optimization tips" }
                  ].map((step, index) => (
                    <Card key={index} className="p-4 text-center">
                      <div className="text-2xl mb-2">{step.icon}</div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 2 && !pageType) ||
                  (currentStep === 3 && !hasValidLinks)
                }
              >
                Continue →
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Setting up..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;