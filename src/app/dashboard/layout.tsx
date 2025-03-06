import DashboardTemplate from '@/components/dashboard/template';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Meteo Graph',
    description: '',
};

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode
}) {
    return (
        <DashboardTemplate>{children}</DashboardTemplate>

    );
}
