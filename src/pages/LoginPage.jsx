import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSignIn, useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { userAtom, userEmailAtom } from "@/atom/userAtoms";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const [, setUserData] = useAtom(userAtom);
  const { isLoaded, isSignedIn, user } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to sync user with backend."
        );
      }

      const userData = await response.json();
      console.log("User Data:", userData.data);
      setUserData(userData.data);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  async function handleOAuthCallback() {
    if (!signInLoaded) return;

    try {
      // Complete the OAuth flow
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.href,
      });

      // Wait for user data to be loaded
      if (!isLoaded || !isSignedIn || !user) {
        throw new Error("User data is not available");
      }

      // Extract email from the user object
      const emailClerk = user.primaryEmailAddress?.emailAddress;

      if (!emailClerk) {
        throw new Error("Email not found in user data");
      }

      // Call your backend API with the user's email
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: emailClerk }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to authenticate with backend");
      }

      const userData = await response.json();
      setUserData(userData.data);

      toast({
        title: "Success",
        description: "Successfully signed in with Google",
      });

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("OAuth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Could not complete Google sign-in",
        variant: "destructive",
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Get started today
          </h1>
          <p className="text-gray-600">
            Explore our comprehensive library of courses, meticulously crafted
            to cater to all levels of expertise.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Sign in to your account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleOAuthCallback}
            // onClick={() =>
            //   signIn?.authenticateWithRedirect({
            //     strategy: "oauth_google",
            //     redirectUrl: "/",
            //     redirectUrlComplete: "/",
            //   })
            // }
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
