function validateFields(data, requiredFields) {
  const missingFields = requiredFields.filter(
    (field) =>
      data[field] === undefined || data[field] === null || data[field] === "",
  );
  if (missingFields.length > 0) {
    throw new Error(`faltan los siguientes campos ${missingFields.join(", ")}`);
  }
}

module.exports = validateFields;
