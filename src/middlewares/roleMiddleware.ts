import { GraphQLError } from "graphql";
import { UserRole } from "@/app/api/services/user/dto/createUserDto";
import { ErrorHandler } from "@/utils/errorHandler";

export const authorizeRoles = (allowedRoles: UserRole[]) => {
    return (resolver: any) => {
        return async (parent: any, args: any, context: any) => {
            const { user } = context

            if (!user) {
                ErrorHandler.handleUnauthorizedError()
            }

            if (!allowedRoles.includes(user.role)) {
                ErrorHandler.handleRoleRestrictError()
            }

            console.log(user, 'its user')

            return resolver(parent, args, context)
        };
    };
};
