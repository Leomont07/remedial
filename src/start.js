import app from './index.js';

// --- AÑADIR MANEJADORES DE PROCESOS ---
process.on('uncaughtException', err => {
  console.error('[CRITICAL] Excepción NO CAPTURADA:', err);
  // No debes mantener el proceso vivo después de uncaughtException.
  process.exit(1); 
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Promesa NO MANEJADA:', reason);
});
// ------------------------------------

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor en ejecución en http://${HOST}:${PORT}`);
});