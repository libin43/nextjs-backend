import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./user";

const modules = [userResolvers];

export const resolvers = mergeResolvers(modules);
