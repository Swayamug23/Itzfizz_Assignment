import "./globals.css";

export const metadata = {
  title: "Itz Fizz — Made to Move",
  description: "A scroll-driven product landing page built with Next.js, Tailwind CSS and GSAP.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
