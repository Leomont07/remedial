import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import authRoutes from './routes/authRoutes.js'
import serviceRoutes from'./routes/serviceRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

export let supabase; 

try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    )
    console.log("INFO: Cliente Supabase inicializado correctamente.");

} catch (e) {
    console.error("CRITICAL ERROR: Fallo al inicializar el cliente Supabase.");
    console.error(e.message);
    supabase = null; 
}

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/service', serviceRoutes)
app.use('/api/booking', bookingRoutes)

// RUTA DE SALUD
app.get('/', (req, res) => { 
  res.status(200).json({ message: 'Bienvenido al server' });
});

const PORT = process.env.PORT || 3000

export default app;