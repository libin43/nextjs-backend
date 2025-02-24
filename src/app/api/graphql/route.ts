import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { gql } from "graphql-tag";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";

// Define your GraphQL schema
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }

//   type User {
//     id: ID!
//     fname: String!
//     lname: String!
//     mobile: String!
//     email: String!
//     password: String!
//     role: String!
//     createdById: ID
//     updatedById: ID
//     createdAt: String!
//     updatedAt: String!
//   }
// `;

// Define your GraphQL resolvers
// const resolvers = {
//   Query: {
//     hello: () => "Hello, world!",
    
//   },
// };

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Create the Next.js API handler
const handler = startServerAndCreateNextHandler<NextRequest>(server);

// Export the route handlers for Next.js API routes
export { handler as GET, handler as POST };
