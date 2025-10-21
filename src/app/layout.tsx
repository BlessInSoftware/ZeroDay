import "./globals.css";

export const metadata = {
  title: "ZeroDay - Incident Tracker",
  description: "Track incidents and count days without issues.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold">Incident Tracker</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
        <footer className="p-4 text-center text-sm text-gray-500">
          ZeroDay - Incident Tracker ©
        </footer>
      </body>
    </html>
  );
}
