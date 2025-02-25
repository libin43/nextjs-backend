import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { gql } from "graphql-tag";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import { GraphQLError, GraphQLFormattedError } from "graphql";

// Define your GraphQL schema
// const typeDefs = gql`
//   type Query {
//     hello: String
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
  resolvers,
  formatError: (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
    if (error instanceof GraphQLError) {
      const extensions = error.extensions as { http?: { status?: number } }
      console.log(extensions, 'extension')
      return {
          ...formattedError,
          extensions: {
              ...formattedError.extensions,
              status: extensions.http?.status || 500,
          },
      };
    }
    return formattedError
},
})

// Create the Next.js API handler
const handler = startServerAndCreateNextHandler<NextRequest>(server)

// Export the route handlers for Next.js API routes
export { handler as GET, handler as POST }
