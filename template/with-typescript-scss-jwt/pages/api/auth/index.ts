import { NextApiRequest, NextApiResponse } from "next";
import { withCatch } from "../../../utils/withCatch";
import jwt from 'jsonwebtoken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const { accessToken, refreshToken } = req.cookies
        if (!accessToken && !refreshToken) throw { code: 401, message: '인증오류' }

        let payload = jwt.verify(accessToken, process.env.NEXT_JWT_SECRET || '') as jwt.JwtPayload

        if (!payload) {
            payload = jwt.verify(refreshToken, process.env.NEXT_JWT_SECRET || '') as jwt.JwtPayload

            if (payload) {
                const accessToken = jwt.sign({ id: payload.id, pw: payload.pw }, process.env.NEXT_JWT_SECRET || '', { expiresIn: '1d' })
                const refreshToken = jwt.sign({ id: payload.id, pw: payload.pw }, process.env.NEXT_JWT_SECRET || '', { expiresIn: '7d' })

                res.setHeader('Set-Cookie', [
                    `accessToken=${accessToken}; max-age=86400; path=/;`,
                    `refreshToken=${refreshToken}; max-age=604800; path=/;`
                ])
            }
        }

        res.json(payload)
    }
}

export default withCatch(handler)