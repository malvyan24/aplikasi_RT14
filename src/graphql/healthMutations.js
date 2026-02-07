import { gql } from "@apollo/client";

export const ADD_HEALTH_RECORD = gql`
  mutation AddHealthRecord(
    $citizenId: ID!, 
    $healthStatus: String, 
    $bloodType: String, 
    $notes: String,
    $chronicDisease: String,
    $height: Float,
    $weight: Float
  ) {
    addHealthRecord(
      citizenId: $citizenId, 
      healthStatus: $healthStatus, 
      bloodType: $bloodType, 
      notes: $notes,
      chronicDisease: $chronicDisease,
      height: $height,
      weight: $weight
    ) {
      id
      healthStatus
    }
  }
`;

export const DELETE_HEALTH_RECORD = gql`
  mutation DeleteHealthRecord($id: ID!) {
    deleteHealthRecord(id: $id)
  }
`;

export const UPDATE_HEALTH_RECORD = gql`
  mutation UpdateHealthRecord($id: ID!, $healthStatus: String, $bloodType: String, $notes: String) {
    updateHealthRecord(id: $id, healthStatus: $healthStatus, bloodType: $bloodType, notes: $notes) {
      id
      healthStatus
    }
  }
`;