import { gql } from "@apollo/client";

export const ADD_HEALTH_RECORD = gql`
  mutation AddHealthRecord(
    $citizenId: ID!, $healthStatus: String, $bloodType: String, $notes: String, $chronicDisease: String,
    $height: Float, $weight: Float, $bloodPressure: String, $bloodSugar: Int,
    $isPregnant: Boolean, $hpl: String, $pregnancyNotes: String   # <--- FIELD BUMIL
  ) {
    addHealthRecord(
      citizenId: $citizenId, healthStatus: $healthStatus, bloodType: $bloodType, notes: $notes, chronicDisease: $chronicDisease,
      height: $height, weight: $weight, bloodPressure: $bloodPressure, bloodSugar: $bloodSugar,
      isPregnant: $isPregnant, hpl: $hpl, pregnancyNotes: $pregnancyNotes
    ) { id healthStatus }
  }
`;

export const UPDATE_HEALTH_RECORD = gql`
  mutation UpdateHealthRecord(
    $id: ID!, $healthStatus: String, $bloodType: String, $height: Float, $weight: Float, 
    $bloodPressure: String, $bloodSugar: Int, $notes: String,
    $isPregnant: Boolean, $hpl: String, $pregnancyNotes: String   # <--- FIELD BUMIL
  ) {
    updateHealthRecord(
      id: $id, healthStatus: $healthStatus, bloodType: $bloodType, height: $height, weight: $weight, 
      bloodPressure: $bloodPressure, bloodSugar: $bloodSugar, notes: $notes,
      isPregnant: $isPregnant, hpl: $hpl, pregnancyNotes: $pregnancyNotes
    ) { id healthStatus }
  }
`;

export const DELETE_HEALTH_RECORD = gql`
  mutation DeleteHealthRecord($id: ID!) { deleteHealthRecord(id: $id) }
`;

export const ADD_SCHEDULE = gql`
  mutation AddSchedule($title: String!, $date: String!, $location: String, $target: String, $description: String) {
    addSchedule(title: $title, date: $date, location: $location, target: $target, description: $description) { id }
  }
`;

export const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($id: ID!) { deleteSchedule(id: $id) }
`;