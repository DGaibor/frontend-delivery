import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CustomButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  isLoading?: boolean;
  loadingText?: string;
}

export function CustomButton({
  children,
  isLoading = false,
  loadingText,
  disabled,
  className,
  ...props
}: CustomButtonProps) {
  return (
    <ShadcnButton
      disabled={disabled || isLoading}
      className={cn("w-full", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          {loadingText || "Cargando..."}
        </>
      ) : (
        children
      )}
    </ShadcnButton>
  );
}
