import { NextApiRequest, NextApiResponse } from "next";

export type ErrorMessage = {
    code: 200 | 301 | 400 | 401 | 500
    message: string
}

export const withCatch = (handler: (req: NextApiRequest, res: NextApiResponse) => any) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await handler(req, res)
    } catch (err: any) {
        console.log(err as ErrorMessage)
        res.status(err.code || 500).json(err)
    }
}