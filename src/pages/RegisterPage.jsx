import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import {
  AlertDialogCancel,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAtom } from "jotai";
import { userAtom, userEmailAtom } from "@/atom/userAtoms";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    photoUrl: "",
    gender: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [, setUser] = useAtom(userAtom);
  const [, setEmail] = useAtom(userEmailAtom);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signUpLoaded) {
      toast({
        title: "Error",
        description: "Sign-up service is not ready. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create user
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      // Start email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setVerificationDialogOpen(true);

      toast({
        title: "Success",
        description: "Please check your email for verification code.",
      });
    } catch (error) {
      console.log("Registration error:", JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
      toast({
        title: "Error",
        description: error.errors[0].message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!signUpLoaded) {
      toast({
        title: "Error",
        description: "Sign-up service is not ready. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setVerificationDialogOpen(false);
        navigate("/");
        // Sync user with backend
        const authToken = completeSignUp.createdSessionId;
        console.log("Auth Token:", completeSignUp);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/profile/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              clerkId: authToken,
              name: formData.name,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              photoUrl: formData.photoUrl,
              gender: formData.gender,
              address: formData.address,
            }),
          }
        );

        // Handle response
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to sync user with backend."
          );
        }
        const data = await response.json();
        setUser(data.data);

        toast({
          title: "Success",
          description: "Email verified successfully!",
        });
        navigate("/");
      } else {
        console.log(JSON.stringify(completeSignUp, null, 2));
        toast({
          title: "Error",
          description: "Verification failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      setError(err.errors[0].message);
      toast({
        title: "Error",
        description: err.errors[0].message,
        variant: "destructive",
      });
    }
  };

  if (!signUpLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Please Register</h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input
                  id="photoUrl"
                  name="photoUrl"
                  type="url"
                  placeholder="Enter photo URL"
                  value={formData.photoUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      <AlertDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Your Email</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the verification code sent to your email address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={onPressVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button type="submit">Verify Email</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
