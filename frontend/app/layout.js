import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'Readora - Library Management',
  description: 'Manage books, students, and borrowing for your library',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
