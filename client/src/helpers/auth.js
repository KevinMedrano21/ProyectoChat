// middleware/auth.js

module.exports = {
    isAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        // Si el usuario está autenticado, permite que continúe
        return next();
      } else {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión o muestra un mensaje de error
        res.redirect('/'); // Cambia '/login' a la ruta de inicio de sesión adecuada
      }
    }
  };
  