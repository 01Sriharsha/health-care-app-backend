export const ApiError = (res, status, message = "Something went wrong!") => {
  return res.status(status).json({
    message,
  });
};

export const ApiSuccess = (res, status, data) => {
  return res.status(status).json({
    success: true,
    ...data,
  });
};
