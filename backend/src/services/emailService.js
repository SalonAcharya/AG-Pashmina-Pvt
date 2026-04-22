const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const FROM_EMAIL = process.env.MAIL_FROM || "Pashmina <onboarding@resend.dev>";

const sendVerificationEmail = async (email, name, code) => {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${code} is your AG Pashmina verification code`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 24px; font-weight: 700; margin: 0; color: #000;">AG Pashmina</h2>
            <p style="color: #666; font-size: 14px; margin-top: 5px;">Exquisite Heritage Textiles</p>
          </div>
          
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; text-align: center;">Verify your account</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #4b5563; text-align: center; margin-bottom: 30px;">
            Hi ${name}, use the verification code below to complete your registration. This code is valid for <strong>5 minutes</strong>.
          </p>
          
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px; letter-spacing: 8px;">
            <span style="font-size: 32px; font-weight: 800; color: #000;">${code}</span>
          </div>
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            If you didn't request this code, you can safely ignore this email.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 30px 0;" />
          
          <div style="text-align: center; font-size: 12px; color: #94a3b8;">
            © 2026 AG Pashmina. All rights reserved.
          </div>
        </div>
      `,
    });
    console.log(`Verification email processed for ${email}`);
  } catch (error) {
    console.error("Resend OTP Email Error:", error);
  }
};

const sendResetOTP = async (email, name, code) => {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${code} is your AG Pashmina reset code`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border: 1px solid #f8fafc; border-radius: 12px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 24px; font-weight: 700; margin: 0; color: #000;">AG Pashmina</h2>
          </div>
          
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; text-align: center;">Account Security Alert</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #4b5563; text-align: center; margin-bottom: 30px;">
            Hi ${name}, we received a request to reset your password. Use the logic below to complete the process. This code is valid for <strong>10 minutes</strong>.
          </p>
          
          <div style="background-color: #000; border-radius: 8px; padding: 25px; text-align: center; margin-bottom: 30px; letter-spacing: 12px;">
            <span style="font-size: 36px; font-weight: 800; color: #fff;">${code}</span>
          </div>
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            If you did not request a password reset, please change your password immediately or contact support.
          </p>
          
          <div style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px;">
            © 2026 AG Pashmina.
          </div>
        </div>
      `,
    });
    console.log(`Reset OTP sent to ${email}`);
  } catch (error) {
    console.error("Resend Reset Email Error:", error);
  }
};

const sendOrderConfirmationEmail = async (email, name, order) => {
  const { id, items, total_amount, shipping_address } = order;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        <div style="font-weight: 600; font-size: 14px;">${item.product_name}</div>
        <div style="color: #666; font-size: 12px;">Size: ${item.size} | Color: ${item.color}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: right; font-size: 14px;">
        ${item.quantity} × $${item.price}
      </td>
    </tr>
  `,
    )
    .join("");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your AG Pashmina Order #${id} is confirmed`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Order Confirmed</h2>
          <p style="color: #666; font-size: 14px; margin-bottom: 32px;">Hi ${name}, your order has been received and is being prepared.</p>
          
          <div style="margin-bottom: 32px;">
            <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 12px; letter-spacing: 1px;">Order Summary #${id}</h4>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
              <tr>
                <td style="padding: 20px 0 0 0; font-weight: 700; font-size: 16px;">Total Amount</td>
                <td style="padding: 20px 0 0 0; text-align: right; font-weight: 700; font-size: 16px;">$${total_amount}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
            <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; letter-spacing: 1px;">Shipping Details</h4>
            <p style="font-size: 14px; margin: 0; line-height: 1.6;">${shipping_address}</p>
          </div>

          <div style="text-align: center;">
            <a href="${FRONTEND_URL}/profile" style="display: inline-block; padding: 14px 32px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View Order Status</a>
          </div>
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 48px;">
            AG Pashmina — Defined by Craftsmanship
          </p>
        </div>
      `,
    });
    console.log(`Order confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Resend Order Confirmation Email Error:", error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendOrderConfirmationEmail,
  sendResetOTP,
};
