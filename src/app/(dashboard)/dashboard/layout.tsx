import DashboardTemplate from '@/components/dashboard/template';

export const metadata = {
    title: 'Meteo Graph - Historical Weather Observations',
    description: 'Access detailed and structured weather observations derived from historical Météo-France data.\n' +
        'Perfect for research, analytics, and visualization.',
};

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode
}) {
    return (
        <DashboardTemplate>
            {children}
        </DashboardTemplate>

    );
}
