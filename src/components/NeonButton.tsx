import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "warning";

type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-slate-950 shadow-[0_0_30px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]",
  secondary:
    "border border-slate-700/70 bg-slate-900/70 text-slate-100 shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-cyan-400/60 hover:shadow-[0_0_28px_rgba(56,189,248,0.35)]",
  warning:
    "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 text-white shadow-[0_0_25px_rgba(217,70,239,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)]",
};

export function NeonButton({ variant = "primary", className = "", children, ...props }: NeonButtonProps) {
  return (
    <button
      {...props}
      className={`group relative overflow-hidden rounded-xl px-5 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 ${variantClasses[variant]} ${className}`}
    >
      <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
