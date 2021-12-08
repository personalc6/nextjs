import { NextApiRequest, NextApiResponse } from "next";
import { withCatch } from "../../../utils/withCatch";
import jwt from 'jsonwebtoken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const { accessToken, refreshToken } = req.cookies
        if (!accessToken && !refreshToken) throw { code: 401, message: '인증 오류' }

        let payload: jwt.JwtPayload = {}
        let newAccessToken: string = ''
        let newRefreshToken: string = ''

        try {
            payload = jwt.verify(accessToken, process.env.NEXT_JWT_SECRET || '') as jwt.JwtPayload
        } catch {
            try {
                payload = jwt.verify(refreshToken, process.env.NEXT_JWT_SECRET || '') as jwt.JwtPayload

                newAccessToken = jwt.sign({ id: payload.id, pw: payload.pw }, process.env.NEXT_JWT_SECRET || '', { expiresIn: '1d' })
                newRefreshToken = jwt.sign({ id: payload.id, pw: payload.pw }, process.env.NEXT_JWT_SECRET || '', { expiresIn: '7d' })
            } catch {
                throw { code: 401, message: '인증 만료' }
            }
        }

        res.json({ payload, newAccessToken, newRefreshToken })
    }
}

export default withCatch(handler)