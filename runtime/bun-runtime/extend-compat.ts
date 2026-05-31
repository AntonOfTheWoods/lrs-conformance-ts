type AnyRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is AnyRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(cloneValue);
  }

  if (isPlainObject(value)) {
    const cloned: AnyRecord = {};
    Object.keys(value).forEach(function (key) {
      cloned[key] = cloneValue(value[key]);
    });
    return cloned;
  }

  return value;
}

function deepMerge(target: AnyRecord, source: AnyRecord): AnyRecord {
  Object.keys(source).forEach(function (key) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (isPlainObject(sourceValue)) {
      const nestedTarget = isPlainObject(targetValue) ? targetValue : {};
      target[key] = deepMerge(nestedTarget, sourceValue);
      return;
    }

    target[key] = cloneValue(sourceValue);
  });

  return target;
}

const extendCompat: LegacyExtendCompat = function (deep: boolean, target: any, source: any): any {
  if (!deep) {
    return Object.assign(target, source);
  }

  return deepMerge(target, source);
};

// Preserve legacy `extend` typing behavior for compatibility with permissive suite code.
export type LegacyExtendCompat = (deep: boolean, target: any, source: any) => any;

export default extendCompat;
