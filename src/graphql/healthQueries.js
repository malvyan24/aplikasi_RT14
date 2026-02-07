import { gql } from "@apollo/client";

export const GET_ALL_HEALTH_RECORDS = gql`
  query GetAllHealthRecords {
    getAllHealthRecords {
      id
      healthStatus
      bloodType
      height
      weight
      chronicDisease
      notes
      createdAt
      citizen { id name nik }
    }
  }
`;

export const GET_HEALTH_STATS = gql`
  query GetHealthStats {
    getHealthStats {
      status
      count
    }
  }
`;

// ini  sebagai cadangan jika ada file lama yang memanggilnya
export const GET_HEALTH_RECORDS = GET_ALL_HEALTH_RECORDS;