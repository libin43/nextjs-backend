import { GraphQLError } from "graphql";

export class ErrorHandler {

    static handleAuthenticationFailedError(message = "Authentication failed") {
        throw new GraphQLError(message, {
            extensions: {
                code: "AUTHENTICATION_FAILED",
                http: { status: 401 },
            },
        });
    }

    static handleUnauthorizedError() {
        throw new GraphQLError("Unauthorized", {
            extensions: {
                code: "UNAUTHORIZED",
                http: { status: 401 },
            },
        });
    }

    static handleValidationError(errors: any) {
        throw new GraphQLError("Validation failed", {
            extensions: {
                code: "BAD_USER_INPUT",
                http: { status: 400 },
                errors: errors.errors,
            },
        });
    }

    static handlePrismaUniqueConstraintError(error: any) {
            throw new GraphQLError(
                `User with this ${error.meta?.target?.join(", ")} already exists`,
                {
                    extensions: {
                        code: "CONFLICT",
                        http: { status: 409 },
                    },
                }
            );
    }

    static handleNotFoundError(entity: string) {
        throw new GraphQLError(`${entity} not found`, {
            extensions: {
                code: "NOT_FOUND",
                http: { status: 404 },
            },
        });
    }

    static internalServerError() {
        throw new GraphQLError("Internal Server Error", {
            extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
        });
    }
}
