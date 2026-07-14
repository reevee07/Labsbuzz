import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(
  ({ label, error, hint, icon, className = '', id, wrapperClassName = '', ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className={`lb-field ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="lb-field__label">
            {label}
          </label>
        )}
        <div className={`lb-field__control ${icon ? 'lb-field__control--icon' : ''} ${error ? 'lb-field__control--error' : ''}`}>
          {icon && <span className="lb-field__icon">{icon}</span>}
          <input ref={ref} id={inputId} className={`lb-field__input ${className}`} {...rest} />
        </div>
        {error && <span className="lb-field__error">{error}</span>}
        {!error && hint && <span className="lb-field__hint">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
