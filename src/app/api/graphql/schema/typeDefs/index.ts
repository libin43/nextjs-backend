import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from "./user";
import { posTypeDefs } from "./post";

const modules = [userTypeDefs, posTypeDefs];

export const typeDefs = mergeTypeDefs(modules);