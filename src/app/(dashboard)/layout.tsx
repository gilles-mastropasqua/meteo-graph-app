import type { Metadata } from 'next';

import '../(dashboard)/globals.css';
import { ThemeProvider } from '@/components/theme-provider';


export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="h-screen flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
