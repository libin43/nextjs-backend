import { gql } from "graphql-tag";

export const userTypeDefs = gql`

#   type UserList {
#     "Sheets Array"
#     data: [Sheet]
#     "Total Number of Sheets"
#     total: Int
#   }

  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    createdById: ID
    updatedById: ID
    createdAt: String!
    updatedAt: String!
  }

  type PostList {
  data: [Post!]!
  totalCount: Int!
}


  type Query {
    getPost(id: ID!): Post!
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
  }

`;
