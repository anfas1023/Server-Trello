export interface IMailer {
    sendEmail(to:string,data:any) : Promise<boolean>
}