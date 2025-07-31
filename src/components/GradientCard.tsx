import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "card";
}

const GradientCard = ({ children, className, variant = "card" }: GradientCardProps) => {
  const variantClasses = {
    primary: "bg-gradient-primary text-primary-foreground",
    secondary: "bg-gradient-secondary text-secondary-foreground",
    card: "bg-gradient-card text-card-foreground"
  };

  return (
    <div className={cn(
      "rounded-2xl p-6 shadow-card",
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
};

export default GradientCard;