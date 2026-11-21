export const passwordRules = [
  {
    label: "At least 6 characters",
    message: "Password must be at least 6 characters.",
    test: (password: string) => password.length >= 6,
  },
  {
    label: "One uppercase letter",
    message: "Password needs at least one uppercase letter.",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    message: "Password needs at least one lowercase letter.",
    test: (password: string) => /[a-z]/.test(password),
  },
];

export function getPasswordError(password: string) {
  const failedRule = passwordRules.find((rule) => !rule.test(password));
  return failedRule ? failedRule.message : null;
}
