import { gql } from "@apollo/client";

export const ADD_WARGA = gql`
  mutation AddWarga(
    $nik: String!
    $nama: String!
    $alamat: String!
    $status: String!
    $tglMasuk: String!
  ) {
    addWarga(
      nik: $nik
      nama: $nama
      alamat: $alamat
      status: $status
      tglMasuk: $tglMasuk
    ) {
      id
      nik
      nama
      alamat
      status
      tglMasuk
    }
  }
`;