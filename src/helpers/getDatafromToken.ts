import jwt from 'jsonwebtoken'

export async function getDatafromToken(token : string) {
    try{
        if(!token) {
            console.log("Token required")
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {id: string}
        return decodedToken.id
    } catch(error: any) {
        console.error("Couldn't decode the token!")
    }
}