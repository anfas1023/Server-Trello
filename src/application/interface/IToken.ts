export interface IToken{
    generateToken(userId:string):string
    generateRefreshToken(userId:string) :string
}