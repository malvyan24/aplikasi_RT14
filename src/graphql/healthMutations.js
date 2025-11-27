import { gql } from "@apollo/client";

export const ADD_HEALTH_DATA = gql`
  mutation AddHealthData($input: HealthInput!) {
    addHealthData(input: $input) {
      id
      value
      date
    }
  }
`;