const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendOtpToEmail = async (email, otp) => {
  // Configure API key
  SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    email: 'fnbcrown3@gmail.com',
    name: 'educate',
  };

  const receivers = [{ email }];

  const emailContent = {
    sender,
    to: receivers,
    subject: 'Your OTP Code',
    htmlContent: `
      <h2>OTP Verification</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  };

  // Send email
  await apiInstance.sendTransacEmail(emailContent);
};

module.exports = sendOtpToEmail;
