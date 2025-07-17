// backend/services/emailService.js
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('cwd:', process.cwd());
console.log('Loaded SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export async function sendEmail(to, subject, message) {

    //console.log(__dirname);
    //console.log(__dirname+'/.env');
    //console.log("tpp_vis_app/back_end/services/.env");
    //console.log('SendGrid API Key starts with:', process.env.SENDGRID_API_KEY.substring(0, 5));

  const msg = {
    to,
    from: process.env.FROM_EMAIL || 'jenny.ohalloran@cranfield.ac.uk',
    subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`[EMAIL] Sent to ${to}`);
  } catch (err) {
    console.error('[EMAIL ERROR]', err?.response?.body || err.message);
    throw err;
  }
}
