import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// 1. Link ke Ngrok Alip (Pastikan link ini update kalau Alip restart Ngrok)
const httpLink = createHttpLink({
  // Minta Alip cek IP laptopnya (ketik ipconfig di CMD)
  // Contoh IP: 192.168.1.15
  uri: "http://192.168.1.26:4002/graphql",
});

// 2. Setup Header Bypass
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "ngrok-skip-browser-warning": "true", // Bypass halaman biru Ngrok
      "apollo-require-preflight": "true", // Bypass keamanan Apollo
    },
  };
});

// 3. Error Handler untuk Debugging
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) =>
      console.error(`[GraphQL error]: ${message}`),
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "no-cache" },
    query: { fetchPolicy: "no-cache" },
  },
});

export default client;
