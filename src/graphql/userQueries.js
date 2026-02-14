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
        placeOfBirth  # WAJIB ADA
        dateOfBirth   # WAJIB ADA (Agar umur bisa dihitung)
        religion
        profession
        relationship
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
      dateOfBirth     # WAJIB ADA
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