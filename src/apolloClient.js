// src/lib/apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Pastikan URL mengarah ke API Gateway (Tanpa /graphql)
const httpLink = createHttpLink({
  uri: "https://transcondyloid-melodramatically-milly.ngrok-free.dev/", // Endpoint API Gateway
});

// Middleware untuk menambahkan token ke header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token"); // Mengambil token dari localStorage
  return {
    headers: {
      ...headers,
      // Jika token ada, kirimkan sebagai Authorization header (tanpa Bearer jika memang backend tidak memerlukan)
      authorization: token ? `Bearer ${token}` : "", 
    },
  };
});

// Membuat instansi Apollo Client dengan middleware
const client = new ApolloClient({
  link: authLink.concat(httpLink),  // Menggabungkan authLink dan httpLink
  cache: new InMemoryCache(),       // Menggunakan cache untuk optimasi query
});

export default client;
