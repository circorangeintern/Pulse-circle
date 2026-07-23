import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  rememberMe: Yup.boolean(),
});

const passwordRules = Yup.string()
  .min(8, "Must be at least 8 characters")
  .matches(/[A-Z]/, "Must include an uppercase letter")
  .matches(/[a-z]/, "Must include a lowercase letter")
  .matches(/[0-9]/, "Must include a number")
  .matches(/[^A-Za-z0-9]/, "Must include a special character")
  .required("Password is required");

export const signupSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: passwordRules,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  agree: Yup.boolean().oneOf([true], "You must agree to the Terms & Conditions"),
});

export const verifyEmailSchema = Yup.object({
  code: Yup.string()
    .matches(/^\d{6}$/, "Enter the 6-digit code")
    .required("Verification code is required"),
});
