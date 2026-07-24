import { useState } from "react";
import { useField } from "formik";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ValidationError from "./ValidationError.jsx";

function PasswordInput({ label, name, placeholder = "••••••••", ...props }) {
  const [field, meta] = useField(name);
  const [visible, setVisible] = useState(false);
  const hasError = meta.touched && meta.error;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
          <FaLock size={14} />
        </span>
        <input
          {...field}
          {...props}
          id={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 placeholder-gray-400 transition-colors focus-ring
            ${hasError ? "border-red-400" : "border-gray-300 hover:border-gray-400"}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus-ring rounded-r-lg"
        >
          {visible ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
        </button>
      </div>
      {hasError && <ValidationError id={`${name}-error`}>{meta.error}</ValidationError>}
    </div>
  );
}

export default PasswordInput;
