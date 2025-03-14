'use server';

import { gql, GraphQLClient } from 'graphql-request';

if (!process.env.NEXT_PUBLIC_METEO_GRAPH_API_URL) {
    throw new Error('Meteo Graph API URL is not defined in the environment variables.');
}

const client = new GraphQLClient(process.env.NEXT_PUBLIC_METEO_GRAPH_API_URL);

interface ObservationsFilters {
    numPoste: string;
    startDate: Date;
    endDate: Date;
    fields: string[];
}

export async function getObservationsHoraireAction(filters: ObservationsFilters) {
    const { numPoste, startDate, endDate, fields } = filters;

    if (!numPoste || !startDate || !endDate || fields.length === 0) {
        throw new Error('Missing required parameters: numPoste, startDate, endDate, or fields');
    }

    // ✅ Génération dynamique de la requête GraphQL
    const query = gql`
        query GetObservationsHoraire($numPoste: String!, $startDate: DateTime!, $endDate: DateTime!) {
            findManyObservationHoraire(
                where: { numPoste: { equals: $numPoste }, dateObservation: { gte: $startDate, lte: $endDate } }, take: 100000
            ) {
                ${fields.join('\n')}
            }
        }
    `;

    try {
        const data = await client.request(query, { numPoste, startDate, endDate });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return data.findManyObservationHoraire;
    } catch (error) {
        console.error('GraphQL Error:', error);
        return [];
    }
}
