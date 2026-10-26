import React, { forwardRef, useId } from 'react';

/**
 * Input — label + input + helper/error text in one component.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    required = false,
    className = '',
    id: idProp,
    type = 'text',
    ...rest
  },
  ref
) {
  const reactId = useId();
  const id = idProp || `egas-input-${reactId}`;
  const describedBy = error ? `${id}-err` : helper ? `${id}-help` : undefined;

  return (
    <div className="egas-field">
      {label && (
        <label
          htmlFor={id}
          className={`egas-label ${required ? 'egas-label--required' : ''}`}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`egas-input ${error ? 'egas-input--error' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      />
      {error && <span id={`${id}-err`} className="egas-error">{error}</span>}
      {!error && helper && (
        <span id={`${id}-help`} className="egas-helper">{helper}</span>
      )}
    </div>
  );
});

export default Input;