import { gql } from '@apollo/client';

// 1. SETOR SAMPAH (Disesuaikan dengan Mutation Pintar addTrashDeposit)
export const ADD_SETORAN = gql`
  mutation AddTrashDeposit($citizenId: ID!, $trashType: String!, $weight: Float!, $pricePerKg: Float!) {
    addTrashDeposit(citizenId: $citizenId, trashType: $trashType, weight: $weight, pricePerKg: $pricePerKg) {
      id
      depositorName
      trashType
      weight
      balance
    }
  }
`;

// 2. TARIK TUNAI
export const WITHDRAW_FUND = gql`
  mutation WithdrawFund($familyId: ID!, $amount: Float!) {
    withdrawFund(familyId: $familyId, amount: $amount) {
      id
      balance
    }
  }
`;

// 3. EDIT BERAT
export const UPDATE_FAMILY_WASTE = gql`
  mutation UpdateFamilyWaste($familyId: ID!, $totalTabungan: Float!) {
    updateFamilyWaste(familyId: $familyId, totalTabungan: $totalTabungan) {
      id
      totalTabungan
    }
  }
`;

// 4. HAPUS DATA / RESET
export const DELETE_TABUNGAN = gql`
  mutation DeleteFamilyWaste($familyId: ID!) {
    deleteFamilyWaste(familyId: $familyId)
  }
`;

// Alias (Tetap dipertahankan agar tidak merusak komponen lain jika ada)
export const ADD_SETORAN_SAMPAH = ADD_SETORAN;
export const DELETE_FAMILY_WASTE = DELETE_TABUNGAN;