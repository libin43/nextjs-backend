'use server'

import { cookies } from "next/headers"

export const setCookie = async (token: string, name: string) => {

    const cookie = (await cookies()).set(name, token, {
        httpOnly: true,
    })
    console.log(cookie, 'cookie')
    console.log('calling')
    // console.log(cookie, 'cookies is set')

    const isCookieSet = (await cookies()).get(name)
    console.log(isCookieSet, 'is cookie set')
    return
}


export const deleteCookie = async (name: string) => {
    const res = (await cookies()).delete(name)
    console.log(res, 'res')
}