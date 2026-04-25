import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = 18 }: { size?: number }) {
  return <Loader2 size={size} className="text-brand-red animate-spin-slow" aria-hidden />;
}
