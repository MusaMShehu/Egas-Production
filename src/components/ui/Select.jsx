import React, { forwardRef, useId } from 'react';

/**
 * Select — labeled native select with helper/error, matching Input.
 */
const Select = forwardRef(function Select(
  {
    label,
    error,
    helper,
    required = false,
    className = '',
    id: idProp,
    options = [],
    placeholder = 'Select…',
    children,
    ...rest
  },
  ref
) {
  const reactId = useId();
  const id = idProp || `egas-select-${reactId}`;
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
      <select
        ref={ref}
        id={id}
        className={`egas-select ${error ? 'egas-input--error' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <span id={`${id}-err`} className="egas-error">
          {error}
        </span>
      )}
      {!error && helper && (
        <span id={`${id}-help`} className="egas-helper">
          {helper}
        </span>
      )}
    </div>
  );
});

export default Select;