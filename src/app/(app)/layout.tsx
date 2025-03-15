import './css/style.css';

import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata = {
    title: 'Meteo Graph - Historical Weather Observations',
    description: 'Access detailed and structured weather observations derived from historical Météo-France data.\n' +
        'Perfect for research, analytics, and visualization.',
};

export default function AppLayout({
                                      children,
                                  }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="apple-mobile-web-app-title" content="Meteo Graph" />
            <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
            <link rel="shortcut icon" href="/favicon/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
            <meta name="apple-mobile-web-app-title" content="Meteo Graph" />
        </head>
        <body className={`${inter.variable} font-inter antialiased bg-slate-900 text-slate-100 tracking-tight`}>
        <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            {/*<Header />*/}
            {children}
            {/*<Footer />*/}
        </div>
        </body>
        </html>
    );
}
