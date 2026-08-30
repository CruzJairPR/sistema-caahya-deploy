// src/lib/logger.ts
const isDevelopment = process.env.NODE_ENV !== "production";

export const logger = {
  // 🚀 Agrega este método para solucionar el error de raíz
  log: (mensaje: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(mensaje, ...args);
    }
  },
  info: (mensaje: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(`ℹ️ [INFO]: ${mensaje}`, ...args);
    }
  },
  warn: (mensaje: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(`⚠️ [WARN]: ${mensaje}`, ...args);
    }
  },
  error: (mensaje: string, ...args: unknown[]) => {
    console.error(`🚨 [ERROR]: ${mensaje}`, ...args);
  },
};
