import jwt from "jsonwebtoken";

export class Token {
  private JWT_KEY: string = "djhfasddfvfefv";
  private JWT_REFRESHKEY: string = "jdfhjdfjfd";
  generateToken(userId: string): string {
    const accesstoken = jwt.sign({ userId }, this.JWT_KEY);
    return accesstoken;
  }

  generateRefreshToken(userId: string) {
    const refreshToken = jwt.sign({ userId }, this.JWT_REFRESHKEY);
    return refreshToken;
  }
}
