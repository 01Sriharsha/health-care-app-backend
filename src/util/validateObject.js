export const validateObject = (object) => {
  let error = "";
  Object.entries({ ...object }).forEach(([key, value]) => {
    if (!value || value.length === 0) {
      error = `${key} is required!`;
      return;
    }
  });
  return { error };
};
