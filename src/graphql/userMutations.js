import { gql } from "@apollo/client";

export const ADD_WARGA = gql`
  mutation CreateFamily($kepalaKeluarga: String!, $noKK: String!, $address: String, $ownershipStatus: String) {
    createFamily(kepalaKeluarga: $kepalaKeluarga, noKK: $noKK, address: $address, ownershipStatus: $ownershipStatus) {
      id
      kepalaKeluarga
    }
  }
`;

export const UPDATE_FAMILY = gql`
  mutation UpdateFamily($id: ID!, $kepalaKeluarga: String, $noKK: String, $address: String, $ownershipStatus: String) {
    updateFamily(id: $id, kepalaKeluarga: $kepalaKeluarga, noKK: $noKK, address: $address, ownershipStatus: $ownershipStatus) {
      id
      kepalaKeluarga
    }
  }
`;

export const DELETE_WARGA = gql`
  mutation DeleteFamily($id: ID!) {
    deleteFamily(id: $id)
  }
`;

export const ADD_CITIZEN = gql`
  mutation AddCitizen(
    $familyId: ID!, $name: String!, $nik: String!, $gender: String!, 
    $religion: String!, $address: String!, $profession: String!, 
    $placeOfBirth: String!, $dateOfBirth: String!, $relationship: String
  ) {
    addCitizen(
      familyId: $familyId, name: $name, nik: $nik, gender: $gender, 
      religion: $religion, address: $address, profession: $profession, 
      placeOfBirth: $placeOfBirth, dateOfBirth: $dateOfBirth, relationship: $relationship
    ) {
      id
      name
    }
  }
`;

export const DELETE_CITIZEN = gql`
  mutation DeleteCitizen($id: ID!) {
    deleteCitizen(id: $id)
  }
`;