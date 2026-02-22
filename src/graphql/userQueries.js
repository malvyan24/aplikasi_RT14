import { gql } from '@apollo/client';

export const GET_WARGA = gql`
  query GetFamilies {
    families {
      id
      noKK
      kepalaKeluarga
      address
      ownershipStatus
      totalTabungan
      balance
      members {
        id
        name
        nik
        gender
        religion
        profession
        placeOfBirth
        dateOfBirth
        age            
        relationship
        phone          
        insurance      
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
      family {
        kepalaKeluarga
      }
    }
  }
`;

export const GET_SAMPAH_STATS = gql`
  query GetSampahStats {
    sampahStats {
      totalBerat
      totalKKAktif
      totalUang
    }
  }
`;