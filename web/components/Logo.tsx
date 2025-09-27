"use client";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "minimal";
}

export default function Logo({ className = "", size = "md", variant = "default" }: LogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl", 
    lg: "text-4xl"
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-green)] bg-clip-text text-transparent font-extrabold";
      case "minimal":
        return "text-[var(--foreground)] font-semibold";
      default:
        return "text-[var(--foreground)] font-bold";
    }
  };

  return (
    <div className={`${className}`}>
      <span className={`${sizeClasses[size]} ${getVariantClasses()} tracking-tight`}>
        Talentsync
      </span>
    </div>
  );
}
