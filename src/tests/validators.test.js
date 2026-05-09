import { describe, it, expect } from "vitest";
import {
  RULES,
  validateEmail,
  validatePassword,
  validateLoginPassword,
  validateNombre,
  validateTelefono,
  validateCloudinaryUrl,
  validateLoginForm,
  validateRegisterForm,
  validateForgotPasswordForm,
  validateResetPasswordForm,
  validateChangePasswordForm,
  validateContactForm,
} from "../utils/validators";

describe("validateEmail", () => {
  it("retorna error si está vacío", () => {
    expect(validateEmail("")).toBe("El correo es obligatorio");
  });

  it("retorna error si solo contiene espacios", () => {
    expect(validateEmail("   ")).toBe("El correo es obligatorio");
  });

  it("retorna error si no tiene @", () => {
    expect(validateEmail("correoemail.com")).toMatch(/correo.*v[áa]lido/i);
  });

  it("retorna error si no tiene dominio", () => {
    expect(validateEmail("correo@")).toMatch(/correo.*v[áa]lido/i);
  });

  it("retorna error si no tiene extensión", () => {
    expect(validateEmail("correo@dominio")).toMatch(/correo.*v[áa]lido/i);
  });

  it("retorna null con correo válido", () => {
    expect(validateEmail("usuario@email.com")).toBeNull();
  });

  it("trimea y normaliza a minúsculas antes de validar", () => {
    expect(validateEmail("  TEST@EMAIL.COM  ")).toBeNull();
  });

  it("retorna error si supera el máximo de caracteres", () => {
    const largo = "a".repeat(RULES.EMAIL_MAX - 9) + "@email.com";
    expect(validateEmail(largo)).toMatch(/m[aá]s de/i);
  });

  it("retorna null en el límite exacto de caracteres", () => {
    const exacto = "a".repeat(RULES.EMAIL_MAX - 10) + "@email.com";
    expect(validateEmail(exacto)).toBeNull();
  });
});

describe("validatePassword", () => {
  it("retorna error si está vacía", () => {
    expect(validatePassword("")).toMatch(/contrase/i);
  });

  it("retorna error si solo tiene espacios", () => {
    expect(validatePassword("   ")).toMatch(/contrase/i);
  });

  it("retorna error si tiene menos del mínimo de caracteres", () => {
    expect(validatePassword("abc123")).toMatch(/al menos/i);
  });

  it("retorna null con exactamente el mínimo de caracteres", () => {
    expect(validatePassword("a".repeat(RULES.PASSWORD_MIN))).toBeNull();
  });

  it("retorna null con exactamente el máximo de caracteres", () => {
    expect(validatePassword("a".repeat(RULES.PASSWORD_MAX))).toBeNull();
  });

  it("retorna error si supera el máximo de caracteres", () => {
    expect(validatePassword("a".repeat(RULES.PASSWORD_MAX + 1))).toMatch(/m[aá]s de/i);
  });

  it("retorna null con contraseña válida", () => {
    expect(validatePassword("miContrasena123")).toBeNull();
  });
});

describe("validateLoginPassword", () => {
  it("retorna error si está vacía", () => {
    expect(validateLoginPassword("")).toMatch(/contrase/i);
  });

  it("no valida longitud mínima", () => {
    expect(validateLoginPassword("abc")).toBeNull();
  });

  it("retorna null en el límite exacto del máximo", () => {
    expect(validateLoginPassword("a".repeat(RULES.LOGIN_PASSWORD_MAX))).toBeNull();
  });

  it("retorna error si supera el máximo de login", () => {
    expect(validateLoginPassword("a".repeat(RULES.LOGIN_PASSWORD_MAX + 1))).toMatch(
      /m[aá]s de/i,
    );
  });
});

describe("validateNombre", () => {
  it("retorna error si está vacío", () => {
    expect(validateNombre("")).toBe("El nombre es obligatorio");
  });

  it("retorna error si tiene menos del mínimo de caracteres", () => {
    expect(validateNombre("ab")).toMatch(/al menos/i);
  });

  it("retorna null con exactamente el mínimo de caracteres", () => {
    expect(validateNombre("Ana")).toBeNull();
  });

  it("retorna error si supera el máximo de caracteres", () => {
    expect(validateNombre("a".repeat(RULES.NOMBRE_MAX + 1))).toMatch(/m[aá]s de/i);
  });

  it("retorna error si contiene números", () => {
    expect(validateNombre("Juan123")).toMatch(/letras/i);
  });

  it("retorna error si contiene caracteres especiales", () => {
    expect(validateNombre("Juan!")).toMatch(/letras/i);
  });

  it("retorna null con nombre simple", () => {
    expect(validateNombre("Juan")).toBeNull();
  });

  it("retorna null con nombre compuesto y espacios", () => {
    expect(validateNombre("Jose Maria")).toBeNull();
  });

  it("retorna null con tildes", () => {
    expect(validateNombre("Sofía")).toBeNull();
  });

  it("retorna null con ñ", () => {
    expect(validateNombre("Niño")).toBeNull();
  });
});

describe("validateTelefono", () => {
  it("retorna error si está vacío", () => {
    expect(validateTelefono("")).toMatch(/tel[ée]fono.*obligatorio/i);
  });

  it("retorna error si contiene letras", () => {
    expect(validateTelefono("38173abc")).toMatch(/d[ií]gitos/i);
  });

  it("retorna error si tiene menos del mínimo de dígitos", () => {
    expect(validateTelefono("123456")).toMatch(/d[ií]gitos/i);
  });

  it("retorna null con exactamente el mínimo de dígitos", () => {
    expect(validateTelefono("3816123")).toBeNull();
  });

  it("retorna null con 10 dígitos", () => {
    expect(validateTelefono("3816123456")).toBeNull();
  });

  it("retorna null con exactamente el máximo de dígitos", () => {
    expect(validateTelefono("1".repeat(RULES.TELEFONO_MAX))).toBeNull();
  });

  it("retorna error si supera el máximo de dígitos", () => {
    expect(validateTelefono("1".repeat(RULES.TELEFONO_MAX + 1))).toMatch(/d[ií]gitos/i);
  });

  it("retorna error si contiene espacios", () => {
    expect(validateTelefono("3816 123456")).toMatch(/d[ií]gitos/i);
  });
});

describe("validateCloudinaryUrl", () => {
  it("retorna error si está vacía", () => {
    expect(validateCloudinaryUrl("")).toBe("La imagen es obligatoria");
  });

  it("retorna error con URL aleatoria", () => {
    expect(validateCloudinaryUrl("https://otra-url.com/imagen.jpg")).toMatch(/cloudinary/i);
  });

  it("retorna error con URL HTTP de Cloudinary", () => {
    expect(
      validateCloudinaryUrl("http://res.cloudinary.com/demo/image/upload/foto.jpg"),
    ).toMatch(/cloudinary/i);
  });

  it("retorna null con URL válida de Cloudinary", () => {
    expect(
      validateCloudinaryUrl("https://res.cloudinary.com/demo/image/upload/foto.jpg"),
    ).toBeNull();
  });

  it("retorna null con URL de Cloudinary sin extensión", () => {
    expect(validateCloudinaryUrl("https://res.cloudinary.com/demo/image/upload/v123/foto")).toBeNull();
  });

  it("retorna null con URL mayúsculas en el esquema", () => {
    expect(validateCloudinaryUrl("HTTPS://res.cloudinary.com/demo/image/upload/foto.jpg")).toBeNull();
  });
});

describe("validateLoginForm", () => {
  it("retorna ambos errores con campos vacíos", () => {
    const errors = validateLoginForm({ correo: "", password: "" });
    expect(errors.correo).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it("retorna objeto vacío con datos válidos", () => {
    const errors = validateLoginForm({ correo: "user@mail.com", password: "mipass123" });
    expect(errors).toEqual({});
  });

  it("retorna solo error de correo si la contraseña es válida", () => {
    const errors = validateLoginForm({ correo: "no-es-email", password: "mipass123" });
    expect(errors.correo).toBeDefined();
    expect(errors.password).toBeUndefined();
  });

  it("retorna solo error de contraseña si el correo es válido", () => {
    const errors = validateLoginForm({ correo: "user@mail.com", password: "" });
    expect(errors.correo).toBeUndefined();
    expect(errors.password).toBeDefined();
  });
});

describe("validateRegisterForm", () => {
  const valid = {
    nombre: "Juan Garcia",
    telefono: "3816123456",
    correo: "juan@mail.com",
    password: "contrasena123",
    confirmPassword: "contrasena123",
  };

  it("retorna objeto vacío con todos los datos válidos", () => {
    expect(validateRegisterForm(valid)).toEqual({});
  });

  it("retorna error si las contraseñas no coinciden", () => {
    const errors = validateRegisterForm({ ...valid, confirmPassword: "otracontrasena" });
    expect(errors.confirmPassword).toMatch(/coinciden/i);
  });

  it("retorna error si confirmPassword está vacía", () => {
    const errors = validateRegisterForm({ ...valid, confirmPassword: "" });
    expect(errors.confirmPassword).toMatch(/confirmar/i);
  });

  it("retorna errores en todos los campos si están vacíos", () => {
    const errors = validateRegisterForm({
      nombre: "",
      telefono: "",
      correo: "",
      password: "",
      confirmPassword: "",
    });
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(4);
  });
});

describe("validateForgotPasswordForm", () => {
  it("retorna objeto vacío con correo válido", () => {
    expect(validateForgotPasswordForm({ correo: "user@mail.com" })).toEqual({});
  });

  it("retorna error con correo vacío", () => {
    expect(validateForgotPasswordForm({ correo: "" }).correo).toBeDefined();
  });
});

describe("validateResetPasswordForm", () => {
  it("retorna objeto vacío con contraseñas válidas e iguales", () => {
    expect(
      validateResetPasswordForm({ password: "nueva1234", confirmPassword: "nueva1234" }),
    ).toEqual({});
  });

  it("retorna error si la contraseña es muy corta", () => {
    const errors = validateResetPasswordForm({ password: "corta", confirmPassword: "corta" });
    expect(errors.password).toBeDefined();
  });

  it("retorna error si confirmPassword está vacía", () => {
    const errors = validateResetPasswordForm({ password: "nueva1234", confirmPassword: "" });
    expect(errors.confirmPassword).toMatch(/confirmar/i);
  });

  it("retorna error si las contraseñas no coinciden", () => {
    const errors = validateResetPasswordForm({
      password: "nueva1234",
      confirmPassword: "diferente",
    });
    expect(errors.confirmPassword).toMatch(/coinciden/i);
  });
});

describe("validateChangePasswordForm", () => {
  const valid = {
    currentPassword: "actual1234",
    newPassword: "nueva5678",
    confirmPassword: "nueva5678",
  };

  it("retorna objeto vacío con datos válidos", () => {
    expect(validateChangePasswordForm(valid)).toEqual({});
  });

  it("retorna error si la nueva contraseña es igual a la actual", () => {
    const errors = validateChangePasswordForm({
      ...valid,
      newPassword: "actual1234",
      confirmPassword: "actual1234",
    });
    expect(errors.newPassword).toMatch(/distinta/i);
  });

  it("retorna error si confirmPassword no coincide", () => {
    const errors = validateChangePasswordForm({ ...valid, confirmPassword: "diferente" });
    expect(errors.confirmPassword).toMatch(/coinciden/i);
  });

  it("retorna error si la contraseña actual está vacía", () => {
    const errors = validateChangePasswordForm({ ...valid, currentPassword: "" });
    expect(errors.currentPassword).toBeDefined();
  });

  it("retorna error si la nueva contraseña es muy corta", () => {
    const errors = validateChangePasswordForm({
      ...valid,
      newPassword: "corta",
      confirmPassword: "corta",
    });
    expect(errors.newPassword).toBeDefined();
  });
});

describe("validateContactForm", () => {
  const valid = {
    nombre: "Juan Garcia",
    telefono: "3816123456",
    email: "juan@mail.com",
    mensaje: "Este es un mensaje de prueba válido.",
  };

  it("retorna objeto vacío con datos válidos", () => {
    expect(validateContactForm(valid)).toEqual({});
  });

  it("retorna error si el mensaje está vacío", () => {
    const errors = validateContactForm({ ...valid, mensaje: "" });
    expect(errors.mensaje).toBeDefined();
  });

  it("retorna error si el mensaje tiene menos de 10 caracteres", () => {
    const errors = validateContactForm({ ...valid, mensaje: "Hola" });
    expect(errors.mensaje).toMatch(/10/);
  });

  it("retorna error si el mensaje supera 200 caracteres", () => {
    const errors = validateContactForm({ ...valid, mensaje: "a".repeat(201) });
    expect(errors.mensaje).toMatch(/200/);
  });

  it("no retorna error para el mensaje en el límite exacto de 200 caracteres", () => {
    const errors = validateContactForm({ ...valid, mensaje: "a".repeat(200) });
    expect(errors.mensaje).toBeUndefined();
  });
});
