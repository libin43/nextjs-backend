import { gql } from "graphql-tag";

export const userTypeDefs = gql`

#   type UserList {
#     "Sheets Array"
#     data: [Sheet]
#     "Total Number of Sheets"
#     total: Int
#   }

  type User {
    id: ID!
    fname: String!
    lname: String!
    mobile: String!
    email: String!
    password: String!
    role: String!
    # createdById: ID
    # updatedById: ID
    createdAt: String!
    updatedAt: String!
  }

  type UserLoginData {
    fname: String!
    lname: String!
    mobile: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: UserLoginData!
  }

  type UserList {
  data: [User!]!
  totalCount: Int!
}


  type Query {
    hello: String!
    getUser(id: ID!): User!
    getAllUsers(
    search: String
    role: UserRole
    page: Int!
    limit: Int!
  ): UserList!
  }

  enum UserRole {
  USER
  ADMIN
  }


  input CreateUserInput {
    fname: String!
    lname: String!
    mobile: String!
    email: String!
    password: String!
    role: UserRole!
    # createdById: ID
    # updatedById: ID
  }

  input LoginInput {
    mobile: String!
    password: String!
  }


  input UpdateUserInput {
    id: ID!
    fname: String
    lname: String
    mobile: String
    email: String
    password: String
    role: UserRole
  }


  type Mutation {
    createUser(input: CreateUserInput!): User!
    login(input: LoginInput!): AuthPayload!
    updateUser(input: UpdateUserInput!): User!
  }

#   type Query {
#     "Hello Query"
#     hello: String
#     "Get All Sheets"
#     getAllSheets: SheetList
#   }

# "Inputs to create Sheet"
#   input SheetInput {
#     "Sheet Name"
#     name: String
#     "Sheet Amount"
#     amount: String
#     "Sheet Start Date"
#     startDate: String
#     "Sheet End Date"
#     endDate: String
#   }

#   type Mutation {
#     "Create Sheet"
#     createSheet(sheet: SheetInput): Sheet
    
#     "Update Sheet"
#     updateSheet(id: ID!, sheet: SheetInput): Sheet

#     "Delete Sheet"
#     deleteSheet(id: ID!): String
#   }
  
`;
