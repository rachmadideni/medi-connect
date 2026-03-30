import { Outlet } from "react-router";
import { HeartPulse } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SignInButton from "./SignInButton";

export default function PrivateLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <HeartPulse className="w-14 h-14 text-blue-500 mb-2" />
        <h2 className="text-2xl font-bold text-gray-700">Almost there!</h2>
        <p className="text-gray-500 max-w-sm">
          Sign in to access your personalized health experience and connect with trusted doctors.
        </p>
        <SignInButton className="mt-2" />
      </div>
    );
  }

  return <Outlet />;
}
