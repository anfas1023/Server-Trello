function inviteuserTemplate(verificationLink :string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">

    <img src="https://mailmeteor.com/assets/img/meta/verify-email-address.png" alt="Company Logo" style="max-width: 100px; margin-bottom: 20px;">

    <h1 style="color: #3498db;">Email Verification</h1> 
    <p>hello <strong></strong>,</p>
    <p>Yor are been invited To A new Workpsace please cick the below link To add to the new workspace:</p>

    <a href=${verificationLink} style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email </a>

    <p style="margin-top: 20px;">if you are not interested to join this ignore it.</p>
</body>
</html>
    `;
}

export default inviteuserTemplate;

