import { gql } from '@apollo/client';

// 1. Ambil Data Keluarga (Untuk Tabel Rekapitulasi)
export const GET_WARGA = gql`
  query GetFamilies {
    families {
      id
      noKK
      kepalaKeluarga
      address
      ownershipStatus
      
      # Data Bank Sampah
      totalTabungan  # Total Berat (Kg)
      balance        # Total Uang (Rp) - WAJIB ADA
      qrCode         # Kode QR - WAJIB ADA
      
      members {
        id
        name
        nik
        gender
        relationship
      }
    }
  }
`;

// 2. Ambil Data Warga (Untuk Dropdown Input Setoran)
export const GET_ALL_CITIZENS = gql`
  query GetAllCitizens {
    citizens {
      id
      name
      nik
      family {
        id
        noKK
        kepalaKeluarga
      }
    }
  }
`;

// 3. Ambil Statistik Dashboard (Termasuk Total Uang)
export const GET_SAMPAH_STATS = gql`
  query GetSampahStats {
    sampahStats {
      totalBerat
      totalKKAktif
      totalUang      # Statistik Total Uang RT
    }
  }
`;