import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../index.js'
import { generateToken } from '../utils/generateToken.js'
import { sendVerificationEmail } from '../utils/sendEmail.js'

const VERIFY_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_para_verificacion'
const VERIFY_EXPIRY = '1h'
const FRONTEND_URL = 'https://experiencias-unicas-pied.vercel.app'

const generateVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, VERIFY_SECRET, { expiresIn: VERIFY_EXPIRY })
}

export const register = async (req, res) => {
  try {
    const { nombre, email, password, tipo } = req.body

    if (!nombre || !email || !password || !tipo) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    // ¿Ya existe ese email?
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' })
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar usuario nuevo
    const { data: newUserArray, error } = await supabase
      .from('users')
      .insert([{ nombre, email, password: hashedPassword, tipo, isVerified:false }])
      .select('id, nombre, email')
      .single()

    if (error) throw error

    const newUser = newUserArray;

    const verificationToken = generateVerificationToken(newUser.id)

    const verificationLink = `${FRONTEND_URL}/verify/${verificationToken}`

    await sendVerificationEmail(email, nombre, verificationLink)

    res.status(202).json({ 
      message: 'Registro exitoso. Por favor, verifica tu correo electrónico para iniciar sesión.', 
      userId: newUser.id 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyEmail = async (req, res) => {
  const { token } = req.params

  try {
    const decoded = jwt.verify(token, VERIFY_SECRET)
    const userId = decoded.id

    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({ isVerified: true })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) throw updateError

    const sessionToken = generateToken(user.id)

    return res.json({ 
        message: 'Correo verificado exitosamente. Ya puedes iniciar sesión.', 
        token: sessionToken,
        user: user
    })

  } catch (error) {
    console.error('Error de verificación:', error)
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'El enlace de verificación ha expirado.' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Token de verificación inválido.' })
    }
    return res.status(500).json({ message: 'Error en el proceso de verificación.' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan campos' })
    }

    // Buscar usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(400).json({ message: 'Usuario no encontrado' })
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    if (user && !user.isVerified) {
      return res.status(403).json({ message: 'Por favor, verifica tu correo electrónico antes de iniciar sesión.' })
  }

    // Generar token
    const token = generateToken(user.id)

    res.json({ user, token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
