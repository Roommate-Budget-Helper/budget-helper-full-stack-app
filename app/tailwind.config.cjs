/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                evergreen: {
                    100: "#00783E",
                    80: "#4DB89E",
                    60: "#D4EEE2",
                },
                fuschia: {
                    100: "#EF5DA8",
                    80: "#F178B6",
                    60: "#FCDDEC",
                },
                iris: {
                    100: "#5D5FEF",
                    80: "#7879F1",
                    60: "#A5A6F6",
                },
                dorian: "#ECF1F4",
            },
        },
        screens: {
            "2xl": { max: "1535px" },
            // => @media (max-width: 1535px) { ... }

            xl: { max: "1279px" },
            // => @media (max-width: 1279px) { ... }

            lg: { max: "1023px" },
            // => @media (max-width: 1023px) { ... }

            md: { max: "767px" },
            // => @media (max-width: 767px) { ... }

            sm: { max: "639px" },
            // => @media (max-width: 639px) { ... }
        },
    },
    plugins: [],
};
