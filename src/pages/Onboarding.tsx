
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import PageTypeStep from "@/components/onboarding/PageTypeStep";
import AddLinksStep from "@/components/onboarding/AddLinksStep";
import TrackingStep from "@/components/onboarding/TrackingStep";
import SuccessStep from "@/components/onboarding/SuccessStep";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    pageType: "",
    links: [] as Array<{id: string, title: string, url: string}>,
    trackingCode: ""
  });
  const navigate = useNavigate();
  const totalSteps = 5;

  useEffect(() => {
    // Generate tracking code
    const generateTrackingCode = () => {
      const trackingId = `ch_${Math.random().toString(36).substr(2, 9)}`;
      const code = `<script>
  (function() {
    var ch = {
      trackingId: '${trackingId}',
      apiUrl: 'https://api.clickheat.io/track'
    };
    
    document.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        fetch(ch.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: ch.trackingId,
            url: e.target.href,
            title: e.target.textContent,
            x: e.clientX,
            y: e.clientY,
            timestamp: Date.now()
          })
        });
      }
    });
  })();
</script>`;
      setUserData(prev => ({ ...prev, trackingCode: code }));
    };

    generateTrackingCode();
  }, []);

  const handleNext = () => setCurrentStep(prev => prev + 1);
  
  const handlePageTypeSelect = (pageType: string) => {
    setUserData(prev => ({ ...prev, pageType }));
    handleNext();
  };

  const handleLinksAdd = (links: Array<{id: string, title: string, url: string}>) => {
    setUserData(prev => ({ ...prev, links }));
    handleNext();
  };

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update user profile
      await supabase
        .from('profiles')
        .update({
          page_type: userData.pageType,
          onboarding_completed: true,
          onboarding_step: totalSteps
        })
        .eq('id', user.id);

      // Create bio page
      const { data: bioPage } = await supabase
        .from('bio_pages')
        .insert({
          user_id: user.id,
          title: "My Bio Page",
          tracking_code: userData.trackingCode,
          is_published: true
        })
        .select()
        .single();

      if (bioPage) {
        // Add links
        const linksToInsert = userData.links.map((link, index) => ({
          bio_page_id: bioPage.id,
          title: link.title,
          url: link.url,
          position: index
        }));

        await supabase
          .from('links')
          .insert(linksToInsert);
      }

      toast.success("Onboarding completed!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to complete onboarding");
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Welcome to ClickHeat";
      case 2: return "Choose Your Page Type";
      case 3: return "Add Your Links";
      case 4: return "Set Up Tracking";
      case 5: return "You're All Set!";
      default: return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return "Let's build your smart bio link tracker";
      case 2: return "This helps us customize your experience";
      case 3: return "Start with your most important links";
      case 4: return "Choose how to track and display your page";
      case 5: return "Your heatmap tracking is now active";
      default: return "";
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      title={getStepTitle()}
      subtitle={getStepSubtitle()}
    >
      {currentStep === 1 && <WelcomeStep onNext={handleNext} />}
      {currentStep === 2 && <PageTypeStep onNext={handlePageTypeSelect} />}
      {currentStep === 3 && <AddLinksStep onNext={handleLinksAdd} />}
      {currentStep === 4 && (
        <TrackingStep 
          trackingCode={userData.trackingCode} 
          onNext={handleNext} 
        />
      )}
      {currentStep === 5 && <SuccessStep onComplete={handleComplete} />}
    </OnboardingLayout>
  );
};

export default Onboarding;
