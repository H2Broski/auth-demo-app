import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "link";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles = {
      default: "bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4",
      link: "underline-offset-4 hover:underline text-blue-600 h-auto p-0",
    };

    return (
      <button
        type={type}
        className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

const variantStyles = {
  default: "bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4",
  link: "underline-offset-4 hover:underline text-blue-600 h-auto p-0",
  outline:
    "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 h-10 py-2 px-4", // Add this line
};

export { Button };
