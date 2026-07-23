import { useField } from 'formik';
import ValidationError from './ValidationError.jsx';

/**
 * Formik-connected <select>. `options` is an array of { value, label }.
 */
function SelectField({ label, options, ...props }) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-800 mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        {...field}
        {...props}
        id={props.id || props.name}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${props.name}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus-ring
          ${hasError ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && (
        <ValidationError id={`${props.name}-error`}>
          {meta.error}
        </ValidationError>
      )}
    </div>
  );
}

export default SelectField;
