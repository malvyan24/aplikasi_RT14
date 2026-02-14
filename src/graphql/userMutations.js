import { gql } from '@apollo/client';

// 1. KELUARGA (KK)
export const CREATE_FAMILY = gql`
  mutation CreateFamily($kepalaKeluarga: String!, $noKK: String!, $address: String!, $ownershipStatus: String) {
    createFamily(kepalaKeluarga: $kepalaKeluarga, noKK: $noKK, address: $address, ownershipStatus: $ownershipStatus) {
      id
      kepalaKeluarga
      noKK
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

export const DELETE_FAMILY = gql`
  mutation DeleteFamily($id: ID!) {
    deleteFamily(id: $id)
  }
`;

// 2. ANGGOTA KELUARGA (WARGA)
export const ADD_CITIZEN = gql`
  mutation AddCitizen($familyId: ID!, $name: String!, $nik: String!, $gender: String!, $religion: String!, $address: String!, $profession: String!, $placeOfBirth: String!, $dateOfBirth: String!, $relationship: String!) {
    addCitizen(familyId: $familyId, name: $name, nik: $nik, gender: $gender, religion: $religion, address: $address, profession: $profession, placeOfBirth: $placeOfBirth, dateOfBirth: $dateOfBirth, relationship: $relationship) {
      id
      name
    }
  }
`;

// --- NEW: UPDATE ANGGOTA ---
export const UPDATE_CITIZEN = gql`
  mutation UpdateCitizen($id: ID!, $name: String, $nik: String, $gender: String, $relationship: String, $dateOfBirth: String) {
    updateCitizen(id: $id, name: $name, nik: $nik, gender: $gender, relationship: $relationship, dateOfBirth: $dateOfBirth) {
      id
      name
    }
  }
`;

// --- NEW: HAPUS ANGGOTA ---
export const DELETE_CITIZEN = gql`
  mutation DeleteCitizen($id: ID!) {
    deleteCitizen(id: $id)
  }
`;