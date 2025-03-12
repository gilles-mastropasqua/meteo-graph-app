import { useEffect, useState } from 'react';
import { getNonEmptyObservationHoraireFields } from '@/actions/getNonEmptyObservationHoraireFields';
import { usePostesStore } from '@/stores/usePostesStore';
import Loading from '@/app/(dashboard)/dashboard/loading';

export default function NonEmptyFields({ numPoste }: { numPoste: string }) {
    const startDate = usePostesStore((state) => state.startDate);
    const endDate = usePostesStore((state) => state.endDate);

    const [fields, setFields] = useState<{ field: string; description: string | null }[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!numPoste || !startDate || !endDate) return;

        const fetchFields = async () => {
            setLoading(true);
            try {
                const data = await getNonEmptyObservationHoraireFields({
                    numPoste,
                    startDate,
                    endDate,
                });

                const normalizedData = Array.isArray(data)
                    ? data.map((item) => ({
                        field: item.field ?? '',
                        description: item.description ?? 'No description available',
                    }))
                    : null;

                setFields(normalizedData);
            } catch (error) {
                console.error('Error fetching non-empty fields:', error);
                setFields(null);
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, [numPoste, startDate, endDate]);

    return (
        <div className="info_station">
            <div className="space-y-2">
                {loading ? (
                    <Loading />
                ) : fields && fields.length > 0 ? (


                    <table
                        className="w-full text-sm border-spacing-0 rounded-xs overflow-hidden border-collapse">
                        <thead>
                        <tr>
                            <td colSpan={2} className={'rounded-t-xs'}><h3>Available Hourly Observations</h3></td>
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
        </div>
    );
}
