import { gql } from "@apollo/client";

export const GET_ALL_HEALTH_RECORDS = gql`
  query GetAllHealthRecords {
    getAllHealthRecords {
      id
      healthStatus
      bloodType
      height
      weight
      bloodPressure
      bloodSugar
      chronicDisease
      notes
      isPregnant
      hpl
      pregnancyNotes
      createdAt
      citizen { 
        id 
        name 
        nik 
        dateOfBirth 
        gender 
        phone 
        family {
          id
          kepalaKeluarga
          members {
            id
            name
            phone
            relationship
          }
        }
      }
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

export const GET_SCHEDULES = gql`
  query GetSchedules {
    getSchedules {
      id
      title
      date
      location
      target
      description
    }
  }
`;