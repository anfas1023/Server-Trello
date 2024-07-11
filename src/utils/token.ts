import jwt from "jsonwebtoken";

export class Token {
  private JWT_KEY  = process.env.JWT_KEY || " ";
  private JWT_REFRESHKEY: string = process.env.JWT_REFRESHKEY || " ";
  generateToken(userId: string): string {
    console.log("this.JWT_KEY",this.JWT_KEY,this.JWT_REFRESHKEY);
    
    const accesstoken = jwt.sign({ userId }, this.JWT_KEY);

    return accesstoken;
  }

  generateRefreshToken(userId: string) {
    const refreshToken = jwt.sign({ userId }, this.JWT_REFRESHKEY);
    return refreshToken;
  }
}
