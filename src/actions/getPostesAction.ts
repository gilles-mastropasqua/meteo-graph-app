'use server';

import { GraphQLClient } from 'graphql-request';
import { getSdk } from '@/graphql/generated';

if (!process.env.NEXT_PUBLIC_METEO_GRAPH_API_URL) {
    throw new Error('Meteo Graph api url is not defined in the environment variables.');
}

const client = new GraphQLClient(process.env.NEXT_PUBLIC_METEO_GRAPH_API_URL);
const sdk = getSdk(client);

interface PostesFilters {
    startDate: Date;
    endDate: Date;
}

export async function getPostesAction(filters: PostesFilters) {
    try {
        const { findManyPoste } = await sdk.GetPostes(filters);

        return findManyPoste;
    } catch (error) {
        console.error('Erreur GraphQL :', error);
        return [];
    }
}
