export interface HistoryItem {
  menuName: string;
  path: string;
  timestamp: number;
}

// Guarda el menú visitado en el almacenamiento del perfil activo
export const saveToHistory = (menuName: string, path: string) => {
  if (typeof window === "undefined") return;

  const currentRole = localStorage.getItem("userRole");
  if (!currentRole) return;

  // Clave única para separar los historiales por perfil
  const storageKey = `history_${currentRole}`;

  const existingHistory: HistoryItem[] = JSON.parse(
    localStorage.getItem(storageKey) || "[]",
  );

  // Filtramos para evitar que se duplique la misma ruta si se presiona seguido
  const filteredHistory = existingHistory.filter((item) => item.path !== path);

  const newItem: HistoryItem = {
    menuName,
    path,
    timestamp: Date.now(),
  };

  // Guardamos las últimas 8 navegaciónes
  const updatedHistory = [newItem, ...filteredHistory].slice(0, 8);

  localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
};

// Recupera las navegaciónes del perfil activo
export const getProfileHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return [];

  const currentRole = localStorage.getItem("userRole");
  if (!currentRole) return [];

  return JSON.parse(localStorage.getItem(`history_${currentRole}`) || "[]");
};
