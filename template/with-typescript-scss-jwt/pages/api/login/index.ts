import { NextApiRequest, NextApiResponse } from 'next'
import { withCatch } from '../../../utils/withCatch'
import jwt from 'jsonwebtoken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { id, pw } = req.body

        const accessToken = jwt.sign({ id, pw }, process.env.NEXT_JWT_SECRET || '', { expiresIn: '1s' })
        const refreshToken = jwt.sign({ id, pw }, process.env.NEXT_JWT_SECRET || '', { expiresIn: '7d' })

        res.setHeader('Set-Cookie', [
            `accessToken=${accessToken}; max-age=1; path=/;`,
            `refreshToken=${refreshToken}; max-age=604800; path=/;`
        ])

        res.status(301).redirect('/')
    }
}

export default withCatch(handler)
