// import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";

// const httpLink = createHttpLink({
//   // TEMBAK KE PORT 4000 (API GATEWAY)
//   uri: "http://192.168.1.32:4000/graphql",
// });

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem("authToken");
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//       // Header ini opsional jika kawan tidak menggunakan tunnel/ngrok
//       "ngrok-skip-browser-warning": "true",
//     },
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// export default client;

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Menambahkan httpLink ke server proxy yang Anda buat di backend (tidak langsung ke API eksternal)
const httpLink = createHttpLink({
  uri: "https://velutinous-supercivilized-delinda.ngrok-free.dev/graphql", // Ganti dengan alamat server backend
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "ngrok-skip-browser-warning": "true", // Hanya jika Anda menggunakan ngrok untuk tunneling
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
