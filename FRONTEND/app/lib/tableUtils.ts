export const getNestedValue = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

export const setNestedValue = (
  obj: Record<string, unknown>,
  path: string,
  value: string,
): Record<string, unknown> => {
  const keys = path.split(".");
  const result = { ...obj };

  if (keys.length === 1) {
    result[keys[0]] = value;
    return result;
  }

  let current: Record<string, unknown> = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = current[key] as Record<string, unknown> | undefined;
    current[key] = { ...(next ?? {}) };
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;

  return result;
};
