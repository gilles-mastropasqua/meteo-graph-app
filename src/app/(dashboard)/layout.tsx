import '../(dashboard)/globals.css';
import { ThemeProvider } from '@/components/theme-provider';


export const metadata = {
    title: 'Meteo Graph - Historical Weather Observations',
    description: 'Access detailed and structured weather observations derived from historical Météo-France data.\n' +
        'Perfect for research, analytics, and visualization.',
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
            <meta name="apple-mobile-web-app-title" content="Meteo Graph" />
            <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
            <link rel="shortcut icon" href="/favicon/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
            <meta name="apple-mobile-web-app-title" content="Meteo Graph" />
        </head>
        <body className="h-[100dvh] flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
        <script defer src="https://unami-nine.vercel.app/init.js"
                data-website-id="fb6c159e-0f87-4fd0-8ede-8e6249cfa69f"></script>
        </body>
        </html>
    );
}
