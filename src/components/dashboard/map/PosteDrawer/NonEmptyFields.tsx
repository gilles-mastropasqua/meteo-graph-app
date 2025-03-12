import { useEffect, useState } from 'react';
import { getNonEmptyObservationHoraireFields } from '@/actions/getNonEmptyObservationHoraireFields';
import { usePostesStore } from '@/stores/usePostesStore';
import Loading from '@/app/(dashboard)/dashboard/loading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

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
                            <td colSpan={2} className={'rounded-t-xs'}>
                                <h3 className={'flex gap-1 justify-center'}>
                                    <span className={'relative'}>Available Hourly Observations</span>
                                    <TooltipProvider delayDuration={1000} skipDelayDuration={500}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                    <span>
                                                        <Info size={4}
                                                              className={'w-4 h-4 relative top-[-2px] '} />
                                                    </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Available Hourly Observations about the station during the selected
                                                    poste opening
                                                    period.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                </h3>
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
        </div>
    );
}
