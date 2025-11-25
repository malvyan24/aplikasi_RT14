import { gql } from "@apollo/client";

export const GET_WARGA = gql`
  query GetWarga {
    wargas {
      id
      nik
      nama
      alamat
      status
      tglMasuk
    }
  }
`;