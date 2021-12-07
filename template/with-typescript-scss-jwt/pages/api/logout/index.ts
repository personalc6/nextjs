import { NextApiRequest, NextApiResponse } from 'next'
import { withCatch } from '../../../utils/withCatch'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        res.setHeader('Set-Cookie', [
            `accessToken=; max-age=-1; path=/;`,
            `refreshToken=; max-age=-1; path=/;`
        ])

        res.status(301).redirect('/')
    }
}

export default withCatch(handler)
