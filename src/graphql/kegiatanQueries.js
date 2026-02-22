import { gql } from "@apollo/client";

export const GET_KAS_DATA = gql`
  query GetKasData($month: String!, $year: String!) {
    getKasSummary(month: $month, year: $year) {
      totalIn
      totalOut
      balance
      paidPercentage
    }
    getAllExpenses {
      id
      title
      category
      amount
      date
      notes
    }
  }
`;
