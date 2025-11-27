import { gql } from "@apollo/client";

export const GET_SAMPAH = gql`
    query GetSampah {
        sampah {
            idBankSampah
            nama
            alamat
            jenisSampah
            beratSampah
            tanggal
        }
    }
`;