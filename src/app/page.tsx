import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, CloudRain, Compass, Sun, Thermometer, Wind } from 'lucide-react';
import MeteoGraphLogo from '../../public/template/meteo-graph.png';
import * as React from 'react';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header
                className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className={'flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground'}>
                            <Image src={MeteoGraphLogo} alt={''} />
                        </div>
                        <span className="text-xl font-bold">Meteo Graph</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-sm font-medium hover:text-primary">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
                            How It Works
                        </Link>
                        <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
                            Testimonials
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline">Login</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button>Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                    Accurate Weather Observation Data
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Access detailed and reliable weather observations from Météo France stations to make
                                    informed
                                    decisions. Our platform provides hourly weather data collected daily.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link href="/dashboard">
                                    <Button size="lg" className="gap-1">
                                        Access Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button size="lg" variant="outline">
                                        Discover Features
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <Image
                            src="/placeholder.svg?height=550&width=550"
                            width={550}
                            height={550}
                            alt="Weather application interface"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <div
                                className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                Features
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                Everything you need to track weather data
                            </h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                Our platform offers powerful tools to analyze and visualize hourly weather observation
                                data from Météo
                                France stations.
                            </p>
                        </div>
                    </div>
                    <div
                        className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Thermometer className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Accurate Temperature</h3>
                            <p className="text-center text-muted-foreground">
                                Hourly temperature measurements with historical data and trends.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                            <div className="rounded-full bg-primary/10 p-3">
                                <CloudRain className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Precipitation</h3>
                            <p className="text-center text-muted-foreground">
                                Detailed tracking of precipitation with historical patterns.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Wind className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Wind</h3>
                            <p className="text-center text-muted-foreground">
                                Wind direction and speed with graphical visualization.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Sun className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Sunshine</h3>
                            <p className="text-center text-muted-foreground">
                                Sunshine duration and UV measurements to plan your activities.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                            <div className="rounded-full bg-primary/10 p-3">
                                <BarChart3 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Advanced Analytics</h3>
                            <p className="text-center text-muted-foreground">
                                Interactive charts and tables to analyze weather trends.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Compass className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Location-based Data</h3>
                            <p className="text-center text-muted-foreground">
                                Weather data from Météo France stations across different locations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                Our platform collects, analyzes, and presents weather observation data in a simple and
                                intuitive way.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
                        <div className="flex flex-col items-center space-y-4 rounded-lg p-6">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                1
                            </div>
                            <h3 className="text-xl font-bold">Data Collection</h3>
                            <p className="text-center text-muted-foreground">
                                We gather hourly observation data from Météo France weather stations.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 rounded-lg p-6">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                2
                            </div>
                            <h3 className="text-xl font-bold">Advanced Analysis</h3>
                            <p className="text-center text-muted-foreground">
                                Our algorithms analyze the data to provide relevant insights and trends.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 rounded-lg p-6">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                3
                            </div>
                            <h3 className="text-xl font-bold">Clear Visualization</h3>
                            <p className="text-center text-muted-foreground">
                                Access an intuitive dashboard presenting all the information you need.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to explore weather
                                data?</h2>
                            <p className="max-w-[600px] md:text-xl">
                                Access our dashboard now to view hourly weather observations from Météo France stations.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Link href="/dashboard">
                                <Button size="lg" variant="secondary" className="gap-1">
                                    Access Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Users Say</h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                Discover why our users love our weather observation platform.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:gap-12">
                        <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    &#34;This platform has revolutionized how I plan my outdoor activities. The data is
                                    accurate and easy to
                                    understand.&#34;
                                </p>
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    width={40}
                                    height={40}
                                    alt="Avatar"
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="text-sm font-medium">Sophie Martin</p>
                                    <p className="text-sm text-muted-foreground">Hiker</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    &#34;As a farmer, this application has become essential for planning my work. The
                                    historical data and
                                    hourly observations are extremely valuable.&#34;
                                </p>
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    width={40}
                                    height={40}
                                    alt="Avatar"
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="text-sm font-medium">Pierre Durand</p>
                                    <p className="text-sm text-muted-foreground">Farmer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t bg-background py-6 md:py-8">
                <div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div
                            className={'flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground'}>
                            <Image src={MeteoGraphLogo} alt={''} />
                        </div>
                        <span className="text-lg font-bold">Meteo Graph</span>
                    </div>
                    <p className="text-center text-sm text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} Meteo Graph. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                            Privacy
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                            Terms of Use
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
