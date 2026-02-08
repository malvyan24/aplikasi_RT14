import { gql } from '@apollo/client';

// Query untuk statistik ringkasan di bagian atas
export const GET_SAMPAH_STATS = gql`
  query GetSampahStats {
    sampahStats {
      totalBerat
      totalKKAktif
    }
  }
`;

// Query untuk mendapatkan log sampah terbaru jika dibutuhkan
export const GET_RECENT_LOGS = gql`
  query GetRecentLogs {
    allSampah {
      id
      tanggal
      berat
      kategori
      citizen {
        name
      }
    }
  }
`;