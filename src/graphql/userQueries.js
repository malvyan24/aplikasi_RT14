// import { gql } from '@apollo/client';

// /**
//  * Query untuk mengambil seluruh data Kartu Keluarga (KK) 
//  * termasuk daftar anggota (members) di dalamnya.
//  */
// export const GET_WARGA = gql`
//   query GetFamilies {
//     families {
//       id
//       noKK
//       kepalaKeluarga
//       address
//       ownershipStatus
//       totalTabungan
//       balance
//       qrCode
//       members {
//         id
//         name
//         nik
//         gender
//         religion
//         profession
//         placeOfBirth
//         dateOfBirth
//         age            # Field ini akan dihitung otomatis di Backend
//         relationship
//         phone          
//         insurance      
//         statusWarga
//       }
//     }
//   }
// `;

// /**
//  * Query untuk mengambil daftar seluruh warga (penduduk) secara flat
//  * beserta informasi kepala keluarganya.
//  */
// export const GET_ALL_CITIZENS = gql`
//   query GetAllCitizens {
//     citizens {
//       id
//       name
//       nik
//       gender
//       age
//       relationship
//       family {
//         id
//         kepalaKeluarga
//         noKK
//       }
//     }
//   }
// `;

// /**
//  * Query untuk mengambil statistik tabungan sampah di RT 14.
//  */
// export const GET_SAMPAH_STATS = gql`
//   query GetSampahStats {
//     sampahStats {
//       totalBerat
//       totalKKAktif
//       totalUang
//     }
//   }
// `;

// /**
//  * Query untuk mengambil biodata spesifik satu warga berdasarkan ID.
//  */
// export const GET_CITIZEN_BY_ID = gql`
//   query GetCitizenById($id: ID!) {
//     citizen(id: $id) {
//       id
//       name
//       nik
//       gender
//       religion
//       profession
//       address
//       placeOfBirth
//       dateOfBirth
//       age
//       relationship
//       phone
//       insurance
//       family {
//         kepalaKeluarga
//         noKK
//       }
//     }
//   }
// `;


import { gql } from '@apollo/client';

/**
 * Query untuk mengambil seluruh data Kartu Keluarga (KK) 
 * termasuk daftar anggota (members) di dalamnya.
 */
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
      qrCode
      members {
        id
        name
        nik
        gender
        religion
        profession
        placeOfBirth
        dateOfBirth
        age            # Field ini akan dihitung otomatis di Backend
        relationship
        phone          
        email          # <--- TAMBAHAN: Tarik data email dari database
        insurance      
        statusWarga
      }
    }
  }
`;

/**
 * Query untuk mengambil daftar seluruh warga (penduduk) secara flat
 * beserta informasi kepala keluarganya.
 */
export const GET_ALL_CITIZENS = gql`
  query GetAllCitizens {
    citizens {
      id
      name
      nik
      gender
      age
      relationship
      email            # <--- TAMBAHAN: Tarik data email dari database
      family {
        id
        kepalaKeluarga
        noKK
      }
    }
  }
`;

/**
 * Query untuk mengambil statistik tabungan sampah di RT 14.
 */
export const GET_SAMPAH_STATS = gql`
  query GetSampahStats {
    sampahStats {
      totalBerat
      totalKKAktif
      totalUang
    }
  }
`;

/**
 * Query untuk mengambil biodata spesifik satu warga berdasarkan ID.
 */
export const GET_CITIZEN_BY_ID = gql`
  query GetCitizenById($id: ID!) {
    citizen(id: $id) {
      id
      name
      nik
      gender
      religion
      profession
      address
      placeOfBirth
      dateOfBirth
      age
      relationship
      phone
      email            # <--- TAMBAHAN: Tarik data email dari database
      insurance
      family {
        kepalaKeluarga
        noKK
      }
    }
  }
`;