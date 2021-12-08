import { JwtPayload } from "jsonwebtoken";
import { NextPageContext } from "next";
import { createContext, useContext } from "react";

type AuthContextProps = {
    auth: {
        isLogin: boolean
        user: JwtPayload & {
            id: string
            pw: string
        } | null
    }
    login: (id: string, pw: string) => Promise<any>
    logout: () => Promise<any>
}

const initialAuth = { isLogin: false, user: null }
const AuthContext = createContext<AuthContextProps>({ auth: initialAuth, login: async () => { }, logout: async () => { } })

export const getUser = async (ctx: NextPageContext) => {
    const cookie = (ctx.req ? ctx.req.headers.cookie : document.cookie) || ''
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Cookie': cookie
        },
    }).then(response => {
        if(response.ok && response.status === 200) return response.json()
        else throw response.json()
    })
    .then(({ payload, newAccessToken, newRefreshToken }) => {
        if(ctx.res && newAccessToken && newRefreshToken) {
            ctx.res.setHeader('Set-Cookie', [
                `accessToken=${newAccessToken}; max-age=86400; path=/;`,
                `refreshToken=${newRefreshToken}; max-age=604800; path=/;`
            ])
        }

        return { isLogin: true, user: payload }
    })
    .catch(error => ({ isLogin: false, user: null }))
}

export const AuthProvider = (props: any) => {
    const auth = props.auth || initialAuth

    const login = async (id: string, pw: string) => await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ id, pw }),
        redirect: 'follow'
    }).then(response => {
        if (response.redirected) window.location.href = response.url
    })

    const logout = async () => await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        redirect: 'follow'
    }).then(response => {
        if (response.redirected) window.location.href = response.url
    })

    return (
        <AuthContext.Provider value={{ auth, login, logout }} {...props} />
    )
}

export const useAuth = () => useContext(AuthContext)