'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumbStore } from '@/stores/useBreadcrumpStore';

export default function PostePage() {
    const params = useParams(); // ✅ Récupère les paramètres avec `useParams()`
    const posteId = params?.posteId as string; // ✅ Assure que `posteId` est bien une string

    const { setBreadcrumb } = useBreadcrumbStore();

    useEffect(() => {
        if (posteId) {
            setBreadcrumb([
                { label: 'Dashboard', href: '/dashboard' },
                { label: `Poste #${posteId}`, href: `/dashboard/poste/${posteId}` },
            ]);
        }
    }, [posteId, setBreadcrumb]);

    if (!posteId) return <p>Loading...</p>;

    return (
        <h1>hello</h1>
    );
}
