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
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Cookie': ctx.req?.headers.cookie || ''
        }
    })
        .then(response => {
            if(response.ok && response.status === 200) return response.json()
            else throw response.json()
        })
        .then(response => ({ isLogin: true, user: response }))
        .catch(error => ({ isLogin: false, user: null }))
}

export const AuthProvider = (props: any) => {
    const auth = props.auth || initialAuth

    const login = async (id: string, pw: string) => {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ id, pw }),
            redirect: 'follow'
        }).then(response => {
            if (response.redirected) window.location.href = response.url
        })
    }

    const logout = async () => {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            redirect: 'follow'
        }).then(response => {
            if (response.redirected) window.location.href = response.url
        })
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout }} {...props} />
    )
}

export const useAuth = () => useContext(AuthContext)