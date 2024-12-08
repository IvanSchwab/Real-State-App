import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, email, subject, message } = req.body;

        try {
            await axios.post(
                'https://api.resend.com/emails',
                {
                    from: 'onboarding@resend.dev',
                    to: 'ivan_schwab@outlook.com',
                    subject: subject,
                    html: `
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Mensaje:</strong> ${message}</p>
                    `,
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
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}
