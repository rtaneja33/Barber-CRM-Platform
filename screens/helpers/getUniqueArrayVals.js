export function getUniqueArrayVals(array, key) {
    if (typeof key !== 'function') {
        const property = key;
        key = function(item) { return item[property]; };
    }
    return Array.from(array.reduce(function(map, item) {
        const k = key(item);
        if (!map.has(k)) map.set(k, item);
        return map;
    }, new Map()).values());
}
  