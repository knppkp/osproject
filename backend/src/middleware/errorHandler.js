export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === '23505') {
    return res.status(400).json({ error: "Duplicate entry" });
  }
  
  if (err.code === '23503') {
    return res.status(400).json({ error: "Referenced record does not exist" });
  }
  
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};