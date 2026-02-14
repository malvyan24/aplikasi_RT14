import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// 1. Definisikan link utama ke API Gateway lewat Ngrok
// Pastikan URL ini adalah yang terbaru dari terminal Ngrok Anda
const httpLink = createHttpLink({
  uri: "https://transcondyloid-melodramatically-milly.ngrok-free.dev/graphql",
});

// 2. Middleware untuk menyisipkan Header (Auth & Ngrok Bypass)
const authLink = setContext((_, { headers }) => {
  // Mengambil token dari localStorage (Gunakan key 'authToken' sesuai kodingan Login sebelumnya)
  const token = localStorage.getItem("authToken");

  return {
    headers: {
      ...headers,
      // Header Authorization untuk keamanan
      authorization: token ? `Bearer ${token}` : "",
      
      // HEADER KRUSIAL: Agar Ngrok tidak memblokir request dengan halaman peringatan browser
      "ngrok-skip-browser-warning": "true",
    },
  };
});

// 3. Inisialisasi Apollo Client
const client = new ApolloClient({
  // Menggabungkan authLink (header) dengan httpLink (URL)
  link: authLink.concat(httpLink),
  
  // Menggunakan cache standar Apollo
  cache: new InMemoryCache(),
  
  // Opsi tambahan untuk menangani error lebih baik
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default client;