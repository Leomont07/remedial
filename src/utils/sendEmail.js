// src/utils/sendEmail.js
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.mx',
  port: 465, // <-- Cambiar el puerto a 465
  secure: true, // <-- Establecer 'secure' a true para SSL/TLS
  // Ya no necesitamos requireTLS si usamos secure: true
  auth: {
    user: 'leonsiu@lexius.mx',
    pass: 'Leonardocr7.', 
  },
  // Opcional: Esto a veces ayuda con problemas de certificado en entornos locales
  tls: {
    rejectUnauthorized: false
  }
});

export const sendVerificationEmail = async (email, name, verificationLink) => {
  try {
    const mailOptions = {
      from: `Experiencias Únicas <leonsiu@lexius.mx`,
      to: email,
      subject: '👋 ¡Bienvenido! Verifica tu cuenta',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #007bff;">Hola, ${name}!</h2>
            <p>Gracias por registrarte en Experiencias Únicas. Para activar tu cuenta, por favor haz clic en el botón de abajo:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verificar Mi Correo
            </a>
            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>Este enlace expirará pronto.</p>
            <p>Saludos,<br>El equipo de Experiencias Únicas</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Correo de verificación enviado a ${email}`)
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    // En un entorno de producción, puedes manejar este error mejor.
    throw new Error('No se pudo enviar el correo de verificación.')
  }
}