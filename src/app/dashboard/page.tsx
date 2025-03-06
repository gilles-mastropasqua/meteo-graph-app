import Loading from '@/app/dashboard/loading';
import MeteoGraphMap from '@/components/dashboard/map/MeteoGraphMap';
import { Suspense } from 'react';

export default function Page() {
    return (<Suspense fallback={<Loading />}><MeteoGraphMap /></Suspense>);
}
