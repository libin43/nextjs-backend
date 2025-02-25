// import { createSheet, deleteSheet, getAllSheets, updateSheet } from '@/app/api/services/sheets'

import { UserService } from "@/app/api/services/user";
import { CreateUserInputType } from "../../../../../../types/graphql";

const userService = new UserService();

export const userResolvers = {
    Query: {
        hello: () => "Hello World!",

        // getAllSheets: async () => getAllSheets()
    },



    Mutation: {
        createUser: async (_: any, { input }: {input: CreateUserInputType}) => {
            try {
                // console.log(input, 'input')
                const newUser = await userService.createUser(input);
                console.log(newUser, 'created in db')
                return newUser;
            } catch (error) {
                return error
            }
        },
    },
};

// export default sheets;