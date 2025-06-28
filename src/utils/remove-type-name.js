/**
 * Recursively removes all fields named '$typeName' from a JSON object or array
 * @param {any} data - The JSON data to process (object, array, or primitive value)
 * @returns {any} - The processed data with '$typeName' fields removed
 */
function removeTypeName(data) {
  // Handle null or undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => removeTypeName(item));
  }

  // Handle objects
  if (typeof data === "object") {
    const result = {};

    for (const [key, value] of Object.entries(data)) {
      // Skip fields named '$typeName'
      if (key === "$typeName") {
        continue;
      }

      // Recursively process nested values
      result[key] = removeTypeName(value);
    }

    return result;
  }

  // Return primitive values as-is
  return data;
}

export default removeTypeName;
