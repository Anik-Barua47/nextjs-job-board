import { NextApiRequest, NextApiResponse } from "next";

// Define the type for the middleware function
type MiddlewareFunction = (
    req: NextApiRequest,
    res: NextApiResponse,
    callback: (result: any) => void
) => void;

// Updated runMiddleware function with proper types
export function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: MiddlewareFunction
): Promise<void> {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: unknown) => {
            if (result instanceof Error) {
                return reject(result);
            }

            // Ensure `resolve()` matches the Promise<void> return type
            return resolve();
        });
    });
}
