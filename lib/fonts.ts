// Since next/font/google requires network access which is restricted in this build environment,
// we define the font families directly in app/globals.css and export placeholder variables here.
// These mock the shape of Next.js font loaders for clean layout code.

export const fontSans = {
  variable: '--font-sans',
  className: 'font-sans',
};

export const fontHeading = {
  variable: '--font-heading',
  className: 'font-heading',
};
