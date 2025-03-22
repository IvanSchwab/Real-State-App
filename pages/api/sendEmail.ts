import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const ipRequests = new Map<string, { count: number, firstRequestTime: number }>();
const MAX_REQUESTS = 5;
const TIME_WINDOW = 60 * 60 * 1000;

const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getClientIp = (req: NextApiRequest) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(',')[0] || req.socket.remoteAddress;
  return ip;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const ip = getClientIp(req);
  if (!ip) {
    return res.status(500).json({ success: false, message: 'No se pudo determinar la IP' });
  }

  const currentTime = Date.now();
  const requestInfo = ipRequests.get(ip) || { count: 0, firstRequestTime: currentTime };

  if (currentTime - requestInfo.firstRequestTime < TIME_WINDOW) {
    if (requestInfo.count >= MAX_REQUESTS) {
      return res.status(429).json({ success: false, message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' });
    }
    requestInfo.count += 1;
  } else {
    ipRequests.set(ip, { count: 1, firstRequestTime: currentTime });
  }

  console.log('Body recibido:', req.body);

  const { name, email, subject, message, captchaToken } = req.body;

  if (!name || !email || !message || !captchaToken) {
    return res.status(400).json({ success: false, message: 'Todos los campos y el captcha son obligatorios' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Correo electrónico no válido' });
  }

  try {
    const captchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!captchaSecret) {
      throw new Error('La clave secreta de reCAPTCHA no está configurada.');
    }

    const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const { data: captchaData } = await axios.post(
      captchaVerificationUrl,
      {},
      {
        params: {
          secret: captchaSecret,
          response: captchaToken,
          remoteip: ip,
        },
      }
    );

    const scoreThreshold = 0.5;
    if (!captchaData.success || captchaData.score < scoreThreshold) {
      console.error('Error en captcha:', captchaData);
      return res.status(400).json({ success: false, message: 'La verificación del captcha falló' });
    }
  } catch (error) {
    console.error('Error verificando el captcha:', error);
    return res.status(500).json({ success: false, message: 'Error en la verificación del captcha' });
  }

  if (name.length > 100 || subject.length > 100 || message.length > 1000) {
    return res.status(400).json({ success: false, message: 'Alguno de los campos excede el tamaño permitido' });
  }

  const sanitizedMessage = `
    <p><strong>Nombre Completo:</strong> ${sanitize(name)}</p>
    <p><strong>Correo Electrónico:</strong> ${sanitize(email)}</p>
    <p><strong>Mensaje:</strong> ${sanitize(message)}</p>
  `;

  try {
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'onboarding@resend.dev',
        to: 'ivan_schwab@outlook.com',
        subject: subject,
        html: sanitizedMessage,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
        },
      }
    );

    res.status(200).json({ success: true, message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ success: false, message: 'Hubo un error al enviar el correo' });
  }
}
