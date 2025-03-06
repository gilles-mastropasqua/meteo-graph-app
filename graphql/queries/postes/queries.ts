import { gql } from 'graphql-request';

export const GET_POSTES = gql`
    query GetPostes($startDate: DateTime!, $endDate: DateTime!) {
        findManyPoste(
            where: {
                AND: [
                    { datouvr: { lte: $startDate } }  # Le poste a ouvert AVANT OU À la date de début
                    {
                        OR: [
                            { datferm: { equals: null } },  # Poste toujours ouvert
                            { datferm: { gte: $endDate } }  # Fermé après la date de fin
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
