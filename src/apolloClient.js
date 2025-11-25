import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/graphql", // GANTI dengan URL GraphQL backend temanmu
    // kalau backend butuh token:
    // headers: {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    // },
  }),
  cache: new InMemoryCache(),
});

export default client;
