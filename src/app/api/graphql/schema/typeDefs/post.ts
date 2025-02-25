import { gql } from "graphql-tag";

export const posTypeDefs = gql`

#   type UserList {
#     "Sheets Array"
#     data: [Sheet]
#     "Total Number of Sheets"
#     total: Int
#   }

scalar DateTime

  type Post {
    id: ID!
    title: String!
    content: String
    authorId: ID!
    createdById: ID
    updatedById: ID
    createdAt: DateTime!
    updatedAt: DateTime!
  }


  type Author {
    id: ID!
    fname: String
    lname: String
  }

  type PostById {
    id: ID!
    title: String!
    content: String
    author: Author
  }

  type PostList {
  data: [PostById!]!
  totalCount: Int!
}


  type Query {
    getPost(id: ID!): PostById!
    getAllPosts(
    search: String
    page: Int!
    limit: Int!
  ): PostList!
  }


  input CreatePostInput {
    title: String!
    content: String!
    # createdById: ID
    # updatedById: ID
  }


  input UpdatePostInput {
    id: ID!
    title: String
    content: String
  }


  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(id: ID!): Post!
  }

`;
