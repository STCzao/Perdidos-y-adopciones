export const RULES = {
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 64,
  NOMBRE_MIN: 3,
  NOMBRE_MAX: 40,
  TELEFONO_MIN: 7,
  TELEFONO_MAX: 15,
  EMAIL_MAX: 100,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOMBRE_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const TELEFONO_RE = /^[0-9]{7,15}$/;
const CLOUDINARY_RE = /^https:\/\/res\.cloudinary\.com\/.+/i;

export const validateEmail = (value) => {
  const v = value.trim().toLowerCase();
  if (!v) return "El correo es obligatorio";
  if (!EMAIL_RE.test(v)) return "Debe ser un correo válido";
  if (v.length > RULES.EMAIL_MAX) {
    return `El correo no puede tener más de ${RULES.EMAIL_MAX} caracteres`;
  }
  return null;
};

export const validatePassword = (value) => {
  const v = value.trim();
  if (!v) return "La contraseña es obligatoria";
  if (v.length < RULES.PASSWORD_MIN) {
    return `La contraseña debe tener al menos ${RULES.PASSWORD_MIN} caracteres`;
  }
  if (v.length > RULES.PASSWORD_MAX) {
    return `La contraseña no puede tener más de ${RULES.PASSWORD_MAX} caracteres`;
  }
  return null;
};

export const validateNombre = (value) => {
  const v = value.trim();
  if (!v) return "El nombre es obligatorio";
  if (v.length < RULES.NOMBRE_MIN) {
    return `El nombre debe tener al menos ${RULES.NOMBRE_MIN} caracteres`;
  }
  if (v.length > RULES.NOMBRE_MAX) {
    return `El nombre no puede tener más de ${RULES.NOMBRE_MAX} caracteres`;
  }
  if (!NOMBRE_RE.test(v)) {
    return "El nombre solo puede contener letras y espacios";
  }
  return null;
};

export const validateTelefono = (value) => {
  const v = value.trim();
  if (!v) return "El teléfono es obligatorio";
  if (!TELEFONO_RE.test(v)) {
    return `El teléfono debe contener entre ${RULES.TELEFONO_MIN} y ${RULES.TELEFONO_MAX} dígitos`;
  }
  return null;
};

export const validateCloudinaryUrl = (value) => {
  const v = value.trim();
  if (!v) return "La imagen es obligatoria";
  if (!CLOUDINARY_RE.test(v)) return "La imagen debe ser una URL de Cloudinary";
  return null;
};

export const validateLoginForm = ({ correo, password }) => {
  const errors = {};
  const correoErr = validateEmail(correo);
  if (correoErr) errors.correo = correoErr;
  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;
  return errors;
};

export const validateRegisterForm = ({
  nombre,
  telefono,
  correo,
  password,
  confirmPassword,
}) => {
  const errors = {};
  const nombreErr = validateNombre(nombre);
  if (nombreErr) errors.nombre = nombreErr;
  const telErr = validateTelefono(telefono);
  if (telErr) errors.telefono = telErr;
  const correoErr = validateEmail(correo);
  if (correoErr) errors.correo = correoErr;
  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;
  if (!confirmPassword?.trim()) {
    errors.confirmPassword = "Debes confirmar la contraseña";
  } else if (password.trim() !== confirmPassword.trim()) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }
  return errors;
};

export const validateForgotPasswordForm = ({ correo }) => {
  const errors = {};
  const correoErr = validateEmail(correo);
  if (correoErr) errors.correo = correoErr;
  return errors;
};

export const validateResetPasswordForm = ({ password, confirmPassword }) => {
  const errors = {};
  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;
  if (!confirmPassword?.trim()) {
    errors.confirmPassword = "Debes confirmar la contraseña";
  } else if (password.trim() !== confirmPassword.trim()) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }
  return errors;
};

export const validateChangePasswordForm = ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const errors = {};
  const currentErr = validatePassword(currentPassword);
  if (currentErr) errors.currentPassword = currentErr;
  const nextErr = validatePassword(newPassword);
  if (nextErr) errors.newPassword = nextErr;
  if (!confirmPassword?.trim()) {
    errors.confirmPassword = "Debes confirmar la contraseña";
  } else if (newPassword.trim() !== confirmPassword.trim()) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }
  if (
    currentPassword?.trim() &&
    newPassword?.trim() &&
    currentPassword.trim() === newPassword.trim()
  ) {
    errors.newPassword = "La nueva contraseña debe ser distinta a la actual";
  }
  return errors;
};

export const validateContactForm = ({ nombre, telefono, email, mensaje }) => {
  const errors = {};
  const nombreErr = validateNombre(nombre);
  if (nombreErr) errors.nombre = nombreErr;
  const telErr = validateTelefono(telefono);
  if (telErr) errors.telefono = telErr;
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;
  if (!mensaje.trim()) {
    errors.mensaje = "El mensaje es obligatorio.";
  } else if (mensaje.trim().length <= 10) {
    errors.mensaje = "El mensaje debe tener al menos 10 caracteres";
  } else if (mensaje.trim().length >= 200) {
    errors.mensaje = "El mensaje tiene un límite de 200 caracteres";
  }
  return errors;
};
