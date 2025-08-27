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
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ]
  },

  {
    rules: {
      "@typescript-eslint/indent": ["error", "tab"],
      "indent": "off",
      "indent": ["error", "tab", {
        ignoredNodes: [
          "JSXElement *", 
          "JSXElement",
          "JSXFragment *", 
          "JSXFragment"
        ]
      }],
      "no-tabs": "off",
      "no-mixed-spaces-and-tabs": "error",
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
      "eol-last": "error",
      "quotes": ["error", "single", { avoidEscape: true }],
      "semi": ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "warn",
      "react/react-in-jsx-scope": "off",
      "react/jsx-indent": ["error", "tab"],
      "react/jsx-indent-props": ["error", "tab"],
      "react/prop-types": "off"
    }
  }
];

export default eslintConfig;
