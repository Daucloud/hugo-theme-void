/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./layouts/**/*.html",
    "./assets/**/*.css",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "var(--tw-prose-body)",
            a: {
              color: "var(--tw-prose-links)",
              textDecoration: "underline",
              fontWeight: "500",
            },
            "a:hover": {
              color: "var(--tw-prose-links-hover)",
            },
            code: {
              fontWeight: "500",
              backgroundColor: "var(--tw-prose-code-bg)",
              paddingLeft: "0.25rem",
              paddingRight: "0.25rem",
              paddingTop: "0.125rem",
              paddingBottom: "0.125rem",
              borderRadius: "0.25rem",
            },
            "pre code": {
              fontWeight: "inherit",
              backgroundColor: "transparent",
              padding: "0",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
