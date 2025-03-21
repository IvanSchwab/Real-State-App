import axios from 'axios';

const verificarCaptcha = async (captchaToken: string): Promise<boolean> => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      throw new Error('La clave secreta de reCAPTCHA no está configurada.');
    }

    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error('Error al verificar el captcha:', error);
    return false;
  }
};

export default verificarCaptcha;