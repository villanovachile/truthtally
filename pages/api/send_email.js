import nodemailer from 'nodemailer';
import validator from 'validator';

const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  const response = await fetch(verificationUrl, {
    method: 'POST'
  });

  const result = await response.json();

  return result;
};

export default async function handler(req, res) {
  const { name, email, reason, url, message, token } = req.body;

  if (!validator.isLength(name, { min: 1, max: 50 })) {
    return res.status(422).json({ error: 'Invalid name' });
  }

  if (!validator.isEmail(email)) {
    return res.status(422).json({ error: 'Invalid email' });
  }
  if (!validator.isLength(email, { max: 255 })) {
    return res.status(422).json({ error: 'Email too long' });
  }

  if (reason === 'Edit or Remove List' && url) {
    if (!validator.isURL(url, { protocols: ['http', 'https'] })) {
      return res.status(422).json({ error: 'Invalid URL' });
    }
    if (!validator.isLength(url, { max: 60 })) {
      return res.status(422).json({ error: 'URL too long' });
    }
  }

  if (!validator.isLength(message, { min: 1, max: 1000 })) {
    return res.status(422).json({ error: 'Invalid message' });
  }

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const response = await verifyRecaptcha(token);

  if (response.success && response.score >= 0.5) {
    let info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Contact Form - ${reason}`,
      html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${reason === 'Edit or Remove List' && url ? `<p><strong>URL:</strong> ${url}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
    });

    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false });
  }
}
