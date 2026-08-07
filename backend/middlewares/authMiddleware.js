const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'عذراً، يجب تسجيل الدخول للوصول لهذه الخدمة.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'رمز الجلسة غير صالح أو منتهي الصلاحية.' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'عذراً، ليس لديك الصلاحية المطلوبة للوصول لهذا الإجراء.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};
