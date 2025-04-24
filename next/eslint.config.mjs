import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  rules: {
    "no-explicit-any": "warn",
    "no-console": "warn",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "react/react-in-jsx-scope": "off", // Not needed with Next.js
    "react/jsx-uses-react": "off", // Not needed with Next.js
  }
];

export default eslintConfig;
