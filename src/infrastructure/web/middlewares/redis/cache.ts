import redisClient from "../../../config/redisClient";

export function cache(duration) {
  return async (req, res, next) => {
    const key = `__express__${req.originalUrl}`; 
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached.toString()));
    }
    res.sendResponse = res.json;
    res.json = body => {
      redisClient.setEx(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  };
}
