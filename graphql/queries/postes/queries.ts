import { gql } from 'graphql-request';

export const GET_POSTES = gql`
    query GetPostes($startDate: DateTime!, $endDate: DateTime!) {
        findManyPoste(
            where: {
                AND: [
                    { datouvr: { lte: $startDate } }
                    {
                        OR: [
                            { datferm: { equals: null } },
                            { datferm: { gte: $endDate } }
                        ]
                    }
                ]
            },
            take: 10000
        ) {
            alti
            commune
            datferm
            datouvr
            lambx
            lamby
            lat
            lieuDit
            lon
            nomUsuel
            numPoste
            posteOuvert
            typePosteActuel
        }
    }
`;
