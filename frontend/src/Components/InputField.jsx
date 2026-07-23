import { useField } from "formik";
import ValidationError from "./ValidationError.jsx";

/**
 * Formik-connected text input with an optional left icon.
 * `name` must match a key in the Formik `initialValues`.
 */
function InputField({ label, icon, ...props }) {
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
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...field}
          {...props}
          id={props.id || props.name}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${props.name}-error` : undefined}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus-ring
            ${icon ? "pl-10 pr-3" : "px-3"}
            ${hasError ? "border-red-400" : "border-gray-300 hover:border-gray-400"}`}
        />
      </div>
      {hasError && <ValidationError id={`${props.name}-error`}>{meta.error}</ValidationError>}
    </div>
  );
}

export default InputField;
