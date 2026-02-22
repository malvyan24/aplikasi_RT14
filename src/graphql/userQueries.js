import { gql } from '@apollo/client';

// 1. Ambil Data Keluarga & Anggotanya (LENGKAP)
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
        placeOfBirth  
        dateOfBirth   
        religion
        profession
        relationship
        phone       # TAMBAHAN BARU
        insurance   # TAMBAHAN BARU
      }
    }
  }
`;

// 2. Ambil Semua Warga (Flat List)
export const GET_ALL_CITIZENS = gql`
  query GetAllCitizens {
    citizens {
      id
      name
      nik
      gender
      placeOfBirth
      dateOfBirth     
      phone         # TAMBAHAN BARU
      insurance     # TAMBAHAN BARU
      family {
        id
        noKK
        kepalaKeluarga
      }
    }
  }
`;

// 3. Statistik Bank Sampah
export const GET_SAMPAH_STATS = gql`
  query GetSampahStats {
    sampahStats {
      totalBerat
      totalKKAktif
      totalUang
    }
  }
`;