import { gql } from "@apollo/client";

export const GET_HEALTH_DATA = gql`
  query GetHealthData {
    healthData {
      id
      value
      date
    }
  }
`;