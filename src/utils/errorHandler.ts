import { GraphQLError } from "graphql";

export class ErrorHandler {
    static handleValidationError(errors: any) {
        const formattedErrors = errors.map((res: any) => ({
            property: res.property,
            messages: Object.values(res.constraints || {}),
        }));

        throw new GraphQLError("Validation failed", {
            extensions: {
                code: "BAD_USER_INPUT",
                http: { status: 400 },
                errors: formattedErrors,
            },
        });
    }

    static handlePrismaError(error: any) {
        if (error.code === "P2002") {
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

        throw new GraphQLError("Internal Server Error", {
            extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
        });
    }

    static handleNotFoundError(entity: string) {
        throw new GraphQLError(`${entity} not found`, {
            extensions: {
                code: "NOT_FOUND",
                http: { status: 404 },
            },
        });
    }
}
