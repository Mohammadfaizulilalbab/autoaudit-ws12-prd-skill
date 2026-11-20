import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export function Button({ variant = 'secondary', icon, className = '', type = 'button', children, ...rest }: ButtonProps) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`.trim()} {...rest}>
      {icon}
      {children}
    </button>
  );
}
