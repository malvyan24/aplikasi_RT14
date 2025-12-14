import { gql } from "@apollo/client";

export const ADD_WARGA = gql`
  mutation CreateFamily(
    $kepalaKeluarga: String!
    $noKK: String!
    $address: String
    $ownershipStatus: String
  ) {
    createFamily(
      kepalaKeluarga: $kepalaKeluarga
      noKK: $noKK
      address: $address
      ownershipStatus: $ownershipStatus
    ) {
      id
      kepalaKeluarga
    }
  }
`;
