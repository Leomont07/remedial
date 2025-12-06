# Usa una imagen base oficial de Node.js
FROM node:20-alpine

# Crea y establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de manifiesto del proyecto para aprovechar la caché de Docker
# Se asume que el backend tiene varios microservicios, pero el ejemplo es para uno solo
COPY package*.json ./

# Instala las dependencias. Usa --production si solo quieres las dependencias de producción
RUN npm install

# Copia el resto del código fuente al contenedor
COPY . .

# Expón el puerto en el que escucha tu aplicación Express.js
# Cambia 3000 si tu app usa otro puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]