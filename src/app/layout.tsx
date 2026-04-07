import './globals.css';

export const metadata = {
  title: 'ZeroDay - Incident Tracker',
  description: 'Track incidents and count days without issues.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-gray-100 text-gray-900">
        <header className="flex items-center justify-between bg-blue-600 p-4 text-white shadow">
          <h1 className="text-xl font-bold">Incident Tracker</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
        <footer className="p-4 text-center text-sm text-gray-500">ZeroDay - Incident Tracker ©</footer>
      </body>
    </html>
  );
}
