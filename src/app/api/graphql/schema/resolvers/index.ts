import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./user";
import { postResolvers } from "./post";

const modules = [userResolvers, postResolvers];

export const resolvers = mergeResolvers(modules);
