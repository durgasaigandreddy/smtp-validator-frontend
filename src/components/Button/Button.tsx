import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'quiet' | 'danger' | 'ghost'
type ButtonSize = 'small' | 'medium'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const base =
  'relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border font-semibold transition-all duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0'

const sizes: Record<ButtonSize, string> = {
  small: 'min-h-9 px-3.5 text-[13px]',
  medium: 'min-h-11 px-5 text-[15px]',
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-[linear-gradient(135deg,var(--accent-bright),var(--accent))] text-on-accent shadow-low hover:shadow-[0_6px_20px_var(--accent-glow)]',
  quiet:
    'border-hairline bg-surface-raised text-ink hover:border-hairline-strong hover:bg-surface-sunken',
  danger: 'border-transparent bg-danger-soft text-danger hover:brightness-105',
  ghost: 'border-transparent bg-transparent text-ink-soft hover:bg-surface-sunken hover:text-ink',
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    {...props}
  />
)
