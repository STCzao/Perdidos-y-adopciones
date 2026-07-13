import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { authGoogleLogin } from "../services/auth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_SCRIPT_ID = "google-identity-services";

export const useGoogleAuth = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingIdToken, setPendingIdToken] = useState(null);
  const [telefonoError, setTelefonoError] = useState("");
  const [message, setMessage] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(0);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const submit = useCallback(
    async (idToken, telefono) => {
      setIsLoading(true);
      setMessage("Verificando con Google...");

      try {
        const data = await authGoogleLogin({ idToken, telefono });

        if (!data?.success || !data?.accessToken || !data?.usuario) {
          if (data?.errors?.telefono) {
            setPendingIdToken(idToken);
            setTelefonoError(data.errors.telefono);
            setMessage("");
          } else {
            setPendingIdToken(null);
            setTelefonoError("");
            setMessage("No pudimos verificar tu cuenta de Google, intentá de nuevo.");
          }
          return;
        }

        setPendingIdToken(null);
        setTelefonoError("");
        onSuccess(data.usuario);
      } catch (error) {
        console.error(error);
        setMessage("Error de conexión con el servidor");
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess],
  );

  const handleCredential = useCallback(
    (response) => {
      if (!response?.credential) return;
      submit(response.credential);
    },
    [submit],
  );

  const confirmTelefono = useCallback(
    (telefono) => {
      if (!pendingIdToken) return undefined;
      return submit(pendingIdToken, telefono);
    },
    [pendingIdToken, submit],
  );

  // Carga el script de Google Identity Services una sola vez por página.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;

    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return undefined;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptReady(true), {
        once: true,
      });
      return undefined;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);

    return undefined;
  }, []);

  // Mide el ancho del contenedor visual para que el botón real de Google
  // (invisible, superpuesto) ocupe exactamente el mismo espacio.
  useLayoutEffect(() => {
    if (!containerRef.current) return undefined;

    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect?.width || 0);
      if (width > 0) setButtonWidth(width);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // El botón de Google no admite estilos propios, así que se renderiza
  // invisible y superpuesto sobre un botón con el estilo del sitio: el click
  // real lo captura el botón de Google, el usuario ve el de la app.
  useEffect(() => {
    if (!scriptReady || !buttonWidth || !buttonRef.current || !window.google?.accounts?.id) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
    });

    buttonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: buttonWidth,
    });
  }, [scriptReady, buttonWidth, handleCredential]);

  return {
    isEnabled: Boolean(GOOGLE_CLIENT_ID),
    containerRef,
    buttonRef,
    isLoading,
    pendingIdToken,
    telefonoError,
    message,
    confirmTelefono,
  };
};
