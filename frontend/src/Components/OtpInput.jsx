import { useRef } from "react";
import { useField, useFormikContext } from "formik";
import ValidationError from "./ValidationError.jsx";

const LENGTH = 6;

/**
 * Renders `LENGTH` individual digit boxes but stores/validates the value
 * as a single string on the Formik field named `name` (e.g. "code").
 */
function OtpInput({ name = "code", label = "Verification code" }) {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const inputsRef = useRef([]);
  const hasError = meta.touched && meta.error;

  const digits = field.value ? field.value.split("") : [];

  function updateValue(nextDigits) {
    setFieldValue(name, nextDigits.join(""));
  }

  function handleChange(index, rawValue) {
    const value = rawValue.replace(/\D/g, "");
    const next = [...digits];

    if (!value) {
      next[index] = "";
      updateValue(next);
      return;
    }

    // Support typing/pasting more than one character into a single box.
    const chars = value.split("");
    chars.forEach((char, offset) => {
      if (index + offset < LENGTH) next[index + offset] = char;
    });
    updateValue(next);

    const nextIndex = Math.min(index + chars.length, LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        updateValue(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    updateValue(pasted.split(""));
    const lastIndex = Math.min(pasted.length, LENGTH - 1);
    inputsRef.current[lastIndex]?.focus();
  }

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-800 mb-2">{label}</label>
      )}
      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {Array.from({ length: LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digits[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            onBlur={() => setFieldTouched(name, true)}
            aria-label={`Digit ${index + 1} of ${LENGTH}`}
            aria-invalid={hasError ? "true" : "false"}
            className={`h-12 w-full max-w-[3rem] rounded-lg border text-center text-lg font-semibold text-gray-900 transition-colors focus-ring
              ${hasError ? "border-red-400" : "border-gray-300 hover:border-gray-400"}`}
          />
        ))}
      </div>
      {hasError && <ValidationError id={`${name}-error`}>{meta.error}</ValidationError>}
    </div>
  );
}

export default OtpInput;
