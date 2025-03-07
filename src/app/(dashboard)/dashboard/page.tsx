'use client';
import Loading from '@/app/(dashboard)/dashboard/loading';

import MeteoGraphMap from '@/components/dashboard/map/MeteoGraphMap';
import { Suspense, useEffect } from 'react';
import { useBreadcrumbStore } from '@/stores/useBreadcrumpStore';

export default function Page() {

    const { setBreadcrumb } = useBreadcrumbStore();

    useEffect(() => {
        setBreadcrumb([
            { label: 'Dashboard', href: '/dashboard' },
        ]);
    }, [setBreadcrumb]);

    return (<Suspense fallback={<Loading />}><MeteoGraphMap /></Suspense>);
}
