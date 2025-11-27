import { gql } from "@apollo/client";

export const ADD_SAMPAH = gql`
    mutation AddSampah(
        $idBankSampah: String!,
        $nama: String!,
        $alamat: String!,
        $jenisSampah: String!,
        $beratSampah: Float!,
        $tanggal: String!
    ) {
        addSampah(
            idBankSampah: $idBankSampah,
            nama: $nama,
            alamat: $alamat,
            jenisSampah: $jenisSampah,
            beratSampah: $beratSampah,
            tanggal: $tanggal
        ) {
            idBankSampah
            nama
            alamat
            jenisSampah
            beratSampah
            tanggal
        }
    }
`;