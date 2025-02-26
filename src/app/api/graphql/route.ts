import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest, NextResponse } from "next/server";
import { gql } from "graphql-tag";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { NextApiRequest, NextApiResponse } from "next";
import { JwtService } from "@/lib/jwtService";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

// Apollo Server instance
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
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

// Next.js API handler
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    const authHeader: string | null = req.headers.get('authorization');
    let user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
       user = JwtService.verifyToken(token)
      // return { user }
    }
    return { req, user }
  },
  
});

// Export the route handlers for Next.js API routes
// export { handler as GET, handler as POST }

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000', // Allow any origin (or specify allowed domains)
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}


export async function GET(req: NextRequest) {
  const response = await handler(req);
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); 
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function POST(req: NextRequest) {
  const response = await handler(req);
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); 
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}