import { useCatalogo } from "./useCatalogo";
import { ComisionDictaminadora } from "../types/catalogo";

export function useComisionesDictaminadorasData() {
  const { datos, cargando } = useCatalogo<ComisionDictaminadora>(
    "comisiones",
    "",
  );
  return { datos, cargando };
}
