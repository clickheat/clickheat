
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join thousands of creators optimizing their bio links"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
