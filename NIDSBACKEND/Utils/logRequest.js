// utils/logRequest.js  
const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} ${req.body}`);
  next();
};

export default logRequest;
