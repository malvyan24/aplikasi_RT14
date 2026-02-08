import { gql } from '@apollo/client';

// 1. SETOR SAMPAH (Tambah Saldo)
export const ADD_SETORAN = gql`
  mutation AddSetoranSampah($citizenId: ID!, $berat: Float!, $kategori: String!) {
    addSetoranSampah(citizenId: $citizenId, berat: $berat, kategori: $kategori) {
      id
      status
      balance
    }
  }
`;

// 2. TARIK TUNAI (Kurang Saldo)
export const WITHDRAW_FUND = gql`
  mutation WithdrawFund($familyId: ID!, $amount: Float!) {
    withdrawFund(familyId: $familyId, amount: $amount) {
      id
      status
      balance
    }
  }
`;

// 3. EDIT BERAT (Tombol Pensil Biru)
export const UPDATE_FAMILY_WASTE = gql`
  mutation UpdateFamilyWaste($familyId: ID!, $totalTabungan: Float!) {
    updateFamilyWaste(familyId: $familyId, totalTabungan: $totalTabungan) {
      id
      totalTabungan
    }
  }
`;

// 4. HAPUS DATA / RESET (Tombol Sampah Merah)
export const DELETE_TABUNGAN = gql`
  mutation DeleteFamilyWaste($familyId: ID!) {
    deleteFamilyWaste(familyId: $familyId)
  }
`;

// --- ALIAS (PENTING AGAR TIDAK ERROR DI FILE LAMA) ---
export const ADD_SETORAN_SAMPAH = ADD_SETORAN;
export const DELETE_FAMILY_WASTE = DELETE_TABUNGAN;