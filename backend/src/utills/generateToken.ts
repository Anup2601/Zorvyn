import dotenv from "dotenv"
dotenv.config()

import jwt from "jsonwebtoken"

type TokenUser = {
    id: string
    email: string
    role: string
}

const generateToken = (user: TokenUser, res: any) => {

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    }

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {
            expiresIn: "7d"
        }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return token

}

export default generateToken
