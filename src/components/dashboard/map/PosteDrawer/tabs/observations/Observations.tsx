import { Poste } from '@/graphql/generated';
import { usePostesStore } from '@/stores/usePostesStore';
import { useObservationFieldsStore } from '@/stores/useObservationFieldsStore';
import { useEffect, useMemo, useState } from 'react';
import { getObservationsHoraireAction } from '@/actions/getObservationsHoraire';
import { DataTable } from '@/components/dashboard/map/PosteDrawer/tabs/observations/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
    DataTableColumnHeader,
} from '@/components/dashboard/map/PosteDrawer/tabs/observations/data-table-column-header';
import Loading from '@/app/(dashboard)/dashboard/loading';
import { format } from 'date-fns';

const EXCLUDED_FIELDS = ['aaaammjjhh', 'alti', 'lat', 'lon', 'nomUsuel', 'numPoste'];


export default function Observations({ selectedPoste }: { selectedPoste: Poste }) {
    const numPoste = selectedPoste?.numPoste;
    const startDate = usePostesStore((state) => state.startDate);
    const endDate = usePostesStore((state) => state.endDate);
    const { loading, getObservationFields } = useObservationFieldsStore();

    const [fields, setFields] = useState<{ field: string; description: string | null }[]>([]);
    const [observations, setObservations] = useState<{ [key: string]: never }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!numPoste || !startDate || !endDate) return;

        getObservationFields(numPoste, startDate, endDate)
            .then((allFields) => allFields.filter((f) => !EXCLUDED_FIELDS.includes(f.field)))
            .then(setFields);
    }, [numPoste, startDate, endDate, getObservationFields]);

    useEffect(() => {
        if (!numPoste || !startDate || !endDate || fields.length === 0) return;

        setIsLoading(true);
        getObservationsHoraireAction({
            numPoste,
            startDate,
            endDate,
            fields: fields.map((f) => f.field),
        }).then(setObservations).finally(() => setIsLoading(false));
    }, [numPoste, startDate, endDate, fields]);


    const columns = useMemo<ColumnDef<{ [key: string]: never }>[]>(
        () => {
            const sortedFields = fields.sort((a, b) => (a.field === 'dateObservation' ? -1 : b.field === 'dateObservation' ? 1 : 0));

            return sortedFields.map(({ field, description }) => ({
                accessorKey: field,
                enableSorting: true,
                enableHiding: true,
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={field} description={description as string} />
                ),
                cell: (info) => (
                    <div
                        className={``}>
                        {field === 'dateObservation'
                            ? format(info.getValue() as string, 'LLL dd, yyyy HH:mm')
                            : String(info.getValue() ?? '-')}
                    </div>
                ),
            }));
        },
        [fields],
    );

    return (
        <div className={'pointer-events-auto'}>
            {loading || isLoading ? <Loading text={'Loading observations'} /> : null}

            {observations.length > 0 ? (
                <DataTable columns={columns} data={observations} />
            ) : (
                !isLoading && <p>No observations available</p>
            )}
        </div>
    );
}
