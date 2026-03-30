import { useAuth } from "../context/AuthContext";

type Props = {
  className?: string;
  label?: string;
};

export default function SignInButton({ className = "", label = "Sign In Now" }: Props) {
  const { signIn } = useAuth();

  return (
    <button
      onClick={signIn}
      className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all ${className}`}
    >
      {label}
    </button>
  );
}
