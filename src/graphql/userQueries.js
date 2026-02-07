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
      religion
      profession
      family {
        kepalaKeluarga
      }
    }
  }
`;