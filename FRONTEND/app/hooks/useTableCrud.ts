import { useState, useCallback } from "react";
import { logger } from "../lib/logger";

type Notificacion = { mensaje: string; tipo: "success" | "error" };

interface CrudService<T> {
  create: (row: Record<string, string>) => Promise<void>;
  update: (id: string, row: T) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useTableCrud<T extends { _id?: string }>(
  service: CrudService<T>,
  refetch: () => void,
) {
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null);

  const notify = (mensaje: string, tipo: "success" | "error") =>
    setNotificacion({ mensaje, tipo });

  const cerrarNotificacion = () => setNotificacion(null);

  const handleAdd = useCallback(
    async (newRow: Record<string, string>) => {
      try {
        await service.create(newRow);
        notify("Registro agregado correctamente.", "success");
        refetch();
      } catch (err) {
        logger.error("Error al agregar:", err);
        notify(
          err instanceof Error ? err.message : "Error al agregar.",
          "error",
        );
      }
    },
    [service, refetch],
  );

  const handleEdit = useCallback(
    async (updatedRow: T) => {
      if (!updatedRow._id) {
        notify("Registro sin ID válido.", "error");
        return;
      }
      try {
        await service.update(updatedRow._id, updatedRow);
        notify("Cambios guardados con éxito.", "success");
        refetch();
      } catch (err) {
        logger.error("Error al editar:", err);
        notify(
          err instanceof Error ? err.message : "Error al editar.",
          "error",
        );
      }
    },
    [service, refetch],
  );

  const handleDelete = useCallback(
    async (row: T) => {
      if (!row._id) {
        notify("Registro sin ID válido.", "error");
        return;
      }
      try {
        await service.remove(row._id);
        notify("Registro eliminado con éxito.", "success");
        refetch();
      } catch (err) {
        logger.error("Error al eliminar:", err);
        notify(
          err instanceof Error ? err.message : "Error al eliminar.",
          "error",
        );
      }
    },
    [service, refetch],
  );

  return {
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
