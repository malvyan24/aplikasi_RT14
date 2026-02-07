import { gql } from "@apollo/client";

export const GET_WARGA = gql`
  query GetFamilies {
    families {
      id
      noKK
      kepalaKeluarga
      address
      ownershipStatus
      members {
        id
        name
        nik
        gender
        relationship
        religion
        dateOfBirth
      }
    }
  }
`;

export const GET_ALL_CITIZENS = gql`
  query GetAllCitizens {
    citizens {
      id
      name
      nik
      gender
      relationship
      religion
      dateOfBirth
      family {
        kepalaKeluarga
      }
    }
  }
`;