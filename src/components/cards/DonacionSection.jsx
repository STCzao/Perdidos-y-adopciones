import { useEffect, useRef, useState } from "react";
import { IconCheck, IconCopy, IconHeartFilled } from "@tabler/icons-react";
import { DATOS_DONACION } from "../../utils/donacion";

const CAMPOS = [
  { key: "alias", label: "Alias", copiable: true, destacado: true },
  { key: "cbu", label: "CBU", copiable: true, destacado: true },
  { key: "titular", label: "Titular" },
  { key: "banco", label: "Banco" },
  { key: "cuenta", label: "Nº de cuenta", copiable: true },
  { key: "cuit", label: "CUIT", copiable: true },
];

const copiarTexto = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Fallback para navegadores sin Clipboard API o contextos no seguros (http)
    const textarea = document.createElement("textarea");
    textarea.value = texto;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
};

const DonacionSection = ({ id = "donar", className = "" }) => {
  const [copiado, setCopiado] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleCopiar = async (key) => {
    const ok = await copiarTexto(DATOS_DONACION[key]);
    if (!ok) return;
    setCopiado(key);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <section id={id} className={`scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(246,239,228,0.92))] px-5 py-7 shadow-[0_22px_55px_rgba(47,36,29,0.06)] sm:px-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-10 lg:py-10">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[0.66rem] font-bold uppercase tracking-[0.26em] text-[#816959]">
            <IconHeartFilled size={14} className="text-[#d46f49]" aria-hidden="true" />
            Donaciones
          </span>
          <h2 className="font-editorial mt-3 text-[2.3rem] leading-[0.96] text-[#241914] sm:text-[2.9rem]">
            Ayudanos a sostener la red.
          </h2>
          <p className="mt-4 max-w-md text-[0.94rem] leading-relaxed text-[#5f4c41]">
            Con tu aporte cubrimos tratamientos veterinarios, castraciones, alimento y
            traslados de los animales que más lo necesitan. Cualquier monto suma.
          </p>
          <p className="mt-3 max-w-md text-[0.8rem] leading-relaxed text-[#816959]">
            Podés transferir desde cualquier banco o billetera virtual usando el alias o el CBU.
          </p>
        </div>

        <dl className="grid gap-2.5 sm:grid-cols-2">
          {CAMPOS.map(({ key, label, copiable, destacado }) => (
            <div
              key={key}
              className={`flex items-center justify-between gap-3 rounded-[1rem] border px-4 py-3 ${
                destacado
                  ? "border-[#d46f49]/25 bg-white shadow-[0_10px_24px_rgba(212,111,73,0.08)] sm:col-span-2"
                  : "border-[#2f241d]/10 bg-white/70"
              }`}
            >
              <div className="min-w-0">
                <dt className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#9b8574]">
                  {label}
                </dt>
                <dd
                  className={`mt-0.5 break-all font-semibold text-[#241914] ${
                    destacado ? "text-[1.05rem] sm:text-[1.15rem]" : "text-[0.92rem]"
                  } ${key === "cbu" || key === "cuenta" ? "tabular-nums tracking-wide" : ""}`}
                >
                  {DATOS_DONACION[key]}
                </dd>
              </div>

              {copiable && (
                <button
                  type="button"
                  onClick={() => handleCopiar(key)}
                  className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-[#2f241d]/12 bg-[#fffaf4] px-3 py-1.5 text-[0.72rem] font-bold text-[#241914] transition-colors hover:bg-[#efe2d0]"
                  aria-label={`Copiar ${label}`}
                >
                  {copiado === key ? (
                    <>
                      <IconCheck size={14} className="text-[#768B44]" aria-hidden="true" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <IconCopy size={14} aria-hidden="true" />
                      Copiar
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default DonacionSection;
