import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

/**
 * Reusable pill-shaped button.
 * variant: primary | secondary | outline | ghost | danger
 * size: sm | md | lg
 * If `to` prop given, renders a router Link styled as a button.
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon = null,
      iconPosition = 'left',
      to,
      className = '',
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const classes = [
      'lb-btn',
      `lb-btn--${variant}`,
      `lb-btn--${size}`,
      fullWidth ? 'lb-btn--full' : '',
      loading ? 'lb-btn--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {loading && <span className="lb-btn__spinner" aria-hidden="true" />}
        {icon && iconPosition === 'left' && !loading && (
          <span className="lb-btn__icon">{icon}</span>
        )}
        <span className="lb-btn__label">{children}</span>
        {icon && iconPosition === 'right' && !loading && (
          <span className="lb-btn__icon">{icon}</span>
        )}
      </>
    );

    if (to) {
      return (
        <Link ref={ref} to={to} className={classes} {...rest}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
