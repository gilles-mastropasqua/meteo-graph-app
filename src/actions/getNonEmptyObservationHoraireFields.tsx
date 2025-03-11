'use server';

import { GraphQLClient } from 'graphql-request';
import { getSdk } from '@/graphql/generated';

if (!process.env.NEXT_PUBLIC_METEO_GRAPH_API_URL) {
    throw new Error('Meteo Graph api url is not defined in the environment variables.');
}

const client = new GraphQLClient(process.env.NEXT_PUBLIC_METEO_GRAPH_API_URL);
const sdk = getSdk(client);

interface GetNonEmptyObservationHoraireFieldsFilters {
    numPoste?: string;
    startDate: Date;
    endDate: Date;
}

export async function getNonEmptyObservationHoraireFields(filters: GetNonEmptyObservationHoraireFieldsFilters) {
    try {
        if (!filters.numPoste) {
            console.warn('getNonEmptyObservationHoraireFields called without numPoste');
            return [];
        }
        if (!filters.startDate || !filters.endDate) {
            throw new Error('startDate and endDate are required.');
        }

        const variables = {
            numPoste: filters.numPoste as string, // TypeScript now knows it's always a string
            startDate: filters.startDate,
            endDate: filters.endDate,
        };

        const { getNonEmptyObservationHoraireFields } = await sdk.GetNonEmptyObservationHoraireFields(variables);

        return getNonEmptyObservationHoraireFields;
    } catch (error) {
        console.error('GraphQL Error in getNonEmptyObservationHoraireFields:', error);
        return [];
    }
}
