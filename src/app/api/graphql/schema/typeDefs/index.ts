import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from "./user";

const modules = [userTypeDefs];

export const typeDefs = mergeTypeDefs(modules);