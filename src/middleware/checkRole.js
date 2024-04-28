export default function checkRole (role) {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role

      if (userRole !== role) {
        return res
          .status(403)
          .json({ status: 'fail', message: 'Access Denied' })
      }
      next()
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        error: err.message
      })
    }
  }
}
