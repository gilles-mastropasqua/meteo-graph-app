import { gql } from 'graphql-request';

export const GET_NON_EMPTY_OBSERVATION_HORAIRE_FIELDS = gql`
    query GetNonEmptyObservationHoraireFields($numPoste: String!, $startDate: DateTime!, $endDate: DateTime!) {
        getNonEmptyObservationHoraireFields(numPoste: $numPoste, startDate: $startDate, endDate: $endDate) {
            field
            description
        }
    }

`;
