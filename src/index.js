import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

// --- 1. Declaración de Variables Globales (Sin importaciones de rutas) ---
export let supabase; 

const app = express()
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

// Función para inicializar Supabase (Manejador de Conexión)
function initializeSupabase() {
    try {
        supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_KEY
        );
        console.log("INFO: Cliente Supabase inicializado correctamente.");

    } catch (e) {
        console.error("CRITICAL ERROR: Fallo al inicializar el cliente Supabase.");
        console.error(e.message);
        supabase = null; 
    }
}
initializeSupabase(); // Se llama una sola vez al inicio

// --- 2. CARGA CONDICIONAL DE RUTAS (DESPUÉS DE SUPABASE) ---
// La única razón por la que esto fallaría es si los archivos de ruta
// (authRoutes, etc.) lanzan una excepción al cargarse (importarse).
// Vamos a restaurar las importaciones de rutas en la parte superior,
// pero el código Express debe estar seguro de que 'supabase' existe.

import authRoutes from './routes/authRoutes.js'
import serviceRoutes from'./routes/serviceRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import userRoutes from './routes/userRoutes.js'

// Rutas (Estas rutas ahora usarán la instancia 'supabase' ya inicializada)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/service', serviceRoutes)
app.use('/api/booking', bookingRoutes)

// RUTA DE SALUD (Esta es la que responde y debe ser estable)
app.get('/', (req, res) => { 
  res.status(200).json({ message: 'Bienvenido al server' });
});

const PORT = process.env.PORT || 3000

export default app;