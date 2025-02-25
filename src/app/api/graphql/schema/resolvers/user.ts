
import { UserService } from "@/app/api/services/user";
import { CreateUserInputType } from "../../../../../../types/graphql";
import { CreateUserInput, UserRole } from "@/app/api/services/user/dto/createUserDto";
import { UpdateUserInput } from "@/app/api/services/user/dto/updateUserDto";

const userService = new UserService();

export const userResolvers = {
    Query: {
        hello: () => "Hello World!",
        getUser: async (_: any, {id}: {id: string})=> {
            try {
                return userService.getUserById(id)
            } catch (error) {
                return error
            }
        },

        getAllUsers: async(_: any, { search, role, page, limit }: { 
            search?: string; 
            role?: UserRole; 
            page: number; 
            limit: number
        }) => {
            try {

                const where: any = {};

                     // Apply search filter
                     if (search) {
                        where.OR = [
                            { fname: { contains: search, mode: "insensitive" } },
                            { lname: { contains: search, mode: "insensitive" } },
                            // { email: { contains: search, mode: "insensitive" } }
                        ];
                    }
    
                    // Apply role filter
                    if (role) {
                        where.role = role;
                    }

                    console.log(where, 'werhere')
                    // if()
                    return userService.getAllUsers(page, limit, where);
                // return userService.getUserById(id)

            } catch (error) {
                return error
            }
        }
        // getAllSheets: async () => getAllSheets()
    },



    Mutation: {
        createUser: async (_: any, { input }: {input: CreateUserInput}) => {
            try {
                // console.log(input, 'input')
                const newUser = await userService.createUser(input);
                console.log(newUser, 'created in db')
                return newUser;
            } catch (error) {
                return error
            }
        },

        updateUser: async (_: any, { input }: {input: UpdateUserInput}) => {
            try {
                // console.log(input, 'input')
                return userService.updateUser(input);
            } catch (error) {
                return error
            }
        },
    },
};

// export default sheets;