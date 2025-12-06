import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import authRoutes from './routes/authRoutes.js'
import serviceRoutes from'./routes/serviceRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())



app.get('/', (req, res) => { 
  res.status(200).json({ message: 'Bienvenido al server' });
});

const PORT = process.env.PORT || 3000 // Usa la variable de entorno o 3000 por defecto

export default app;

//app.listen(PORT, () => {
  //  console.log(`🚀 Servidor en ejecución en el puerto ${PORT}`);
//});