import { useEffect, useState } from 'react';
import { usePostesStore } from '@/stores/usePostesStore';
import { useObservationFieldsStore } from '@/stores/useObservationFieldsStore';
import Loading from '@/app/(dashboard)/dashboard/loading';

export default function NonEmptyFields({ numPoste }: { numPoste: string }) {
    const startDate = usePostesStore((state) => state.startDate);
    const endDate = usePostesStore((state) => state.endDate);
    const { loading, getObservationFields } = useObservationFieldsStore();
    const [fields, setFields] = useState<{ field: string; description: string | null }[]>([]);

    useEffect(() => {
        if (!numPoste || !startDate || !endDate) return;

        getObservationFields(numPoste, startDate, endDate).then(setFields);
    }, [numPoste, startDate, endDate, getObservationFields]);

    return (
        <div className="info_station">
            {loading ? (
                <Loading />
            ) : fields.length > 0 ? (
                <table className="w-full text-sm border-spacing-0 rounded-xs overflow-hidden border-collapse">
                    <thead>
                    <tr>
                        <td colSpan={2} className="rounded-t-xs text-center font-bold">
                            Available Hourly Observations
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {fields.map((field) => (
                        <tr key={field.field}>
                            <td>{field.field}</td>
                            <td>{field.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}
