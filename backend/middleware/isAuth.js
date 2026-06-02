import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
  try { 
    const token = req.cookies.token;  

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" })
    }
    req.userId = decoded.userId;
    next()

  } catch (error) {
    console.log("Auth error:", error)
    return res.status(401).json({ message: "Invalid token" })
  }
}

export default isAuth