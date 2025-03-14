import { create } from 'zustand';
import { getNonEmptyObservationHoraireFields } from '@/actions/getNonEmptyObservationHoraireFields';

interface ObservationFieldsEntry {
    fields: { field: string; description: string | null }[];
    startDate: Date;
    endDate: Date;
}

interface ObservationFieldsState {
    observationFields: Record<string, ObservationFieldsEntry[]>; // Clé : numPoste → Liste d'entrées (dates + champs)
    loading: boolean;
    getObservationFields: (numPoste: string, startDate: Date, endDate: Date) => Promise<
        { field: string; description: string | null }[]
    >;
}

export const useObservationFieldsStore = create<ObservationFieldsState>((set, get) => ({
    observationFields: {},
    loading: false,

    async getObservationFields(numPoste, startDate, endDate) {
        if (!startDate || !endDate) return [];

        const existingFields = get().observationFields[numPoste]?.find(
            (entry) =>
                entry.startDate.getTime() === startDate.getTime() &&
                entry.endDate.getTime() === endDate.getTime(),
        );

        if (existingFields) {
            return existingFields.fields;
        }

        set({ loading: true });

        try {
            const data = await getNonEmptyObservationHoraireFields({ numPoste, startDate, endDate });

            const normalizedData = Array.isArray(data)
                ? data.map((item) => ({
                    field: item.field ?? '',
                    description: item.description ?? 'No description available',
                }))
                : [];

            set((state) => ({
                observationFields: {
                    ...state.observationFields,
                    [numPoste]: [
                        ...(state.observationFields[numPoste] || []),
                        { fields: normalizedData, startDate, endDate },
                    ],
                },
                loading: false,
            }));

            return normalizedData;
        } catch (error) {
            console.error('Error fetching observation fields:', error);
            set({ loading: false });
            return [];
        }
    },
}));
