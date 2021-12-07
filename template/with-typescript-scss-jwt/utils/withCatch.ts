import { NextApiRequest, NextApiResponse } from "next";

export const withCatch = (handler: (req: NextApiRequest, res: NextApiResponse) => any) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await handler(req, res)
    } catch (err: any) {
        res.status(err.code).json(err)
    }
}