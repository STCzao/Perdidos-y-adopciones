import { Fragment, useState } from "react";
import { colaboradoresService } from "../../services/colaboradores";
import { LOCALIDADES_TUCUMAN } from "../../utils/localidades";
import {
  DETALLE_CAMPO,
  FORMAS_COLABORACION,
  LABELS_DISPONIBILIDAD,
  LABELS_MOMENTOS,
  OPCIONES_DETALLE,
} from "../../utils/colaboradoresConstants";

// ── datos ────────────────────────────────────────────────────────────────────

const FORM_INICIAL = {
  nombre: "",
  telefono: "",
  email: "",
  localidad: "",
  barrio: "",
  direccionReferencia: "",
  formasColaboracion: [],
  detalleTransito: { opciones: [], observaciones: "" },
  detalleTraslado: { opciones: [], observaciones: "" },
  detalleAvistamiento: { opciones: [], observaciones: "" },
  detalleDifusion: { opciones: [], observaciones: "" },
  detalleCoordinacion: { opciones: [], observaciones: "" },
  detalleEconomico: { opciones: [], observaciones: "" },
  disponibilidadGeneral: "",
  momentosDisponibilidad: [],
  aceptaContactoWhatsapp: false,
  quiereGruposWhatsapp: false,
  prefiereContactoIndividual: false,
  observacionesFinales: "",
  aceptaTerminos: false,
};

const DESCRIPCIONES_FORMA = {
  AVISTAMIENTO:
    "Estar atento/a a casos cercanos y colaborar mirando en la zona cuando se reporta un animal perdido o visto cerca.",
  COORDINACION:
    "Puede incluir contactar personas, ordenar información, hacer seguimiento de casos o conectar necesidades con personas disponibles.",
};

const buildPayload = (form) => {
  const base = {
    nombre: form.nombre,
    telefono: form.telefono,
    localidad: form.localidad,
    barrio: form.barrio,
    formasColaboracion: form.formasColaboracion,
    disponibilidadGeneral: form.disponibilidadGeneral,
    momentosDisponibilidad: form.momentosDisponibilidad,
    aceptaContactoWhatsapp: form.aceptaContactoWhatsapp,
    quiereGruposWhatsapp: form.quiereGruposWhatsapp,
    prefiereContactoIndividual: form.prefiereContactoIndividual,
    aceptaTerminos: form.aceptaTerminos,
    ...(form.email && { email: form.email }),
    ...(form.direccionReferencia && { direccionReferencia: form.direccionReferencia }),
    ...(form.observacionesFinales && { observacionesFinales: form.observacionesFinales }),
  };
  form.formasColaboracion.forEach((forma) => {
    const campo = DETALLE_CAMPO[forma];
    base[campo] = form[campo];
  });
  return base;
};

const toggleForma = (form, forma) => {
  const yaEsta = form.formasColaboracion.includes(forma);
  const nuevas = yaEsta
    ? form.formasColaboracion.filter((f) => f !== forma)
    : [...form.formasColaboracion, forma];
  return {
    ...form,
    formasColaboracion: nuevas,
    ...(yaEsta && { [DETALLE_CAMPO[forma]]: { opciones: [], observaciones: "" } }),
  };
};

const toggleOpcionDetalle = (form, campo, opcion) => {
  const actuales = form[campo].opciones;
  const nuevas = actuales.includes(opcion)
    ? actuales.filter((o) => o !== opcion)
    : [...actuales, opcion];
  return { ...form, [campo]: { ...form[campo], opciones: nuevas } };
};

// ── sub-componentes visuales ──────────────────────────────────────────────────

const blockClass =
  "bg-[#fffaf4] border border-[#2f241d]/10 rounded-[1.1rem] p-6 mb-5";

const inputClass =
  "w-full rounded-[0.7rem] border border-[#2f241d]/12 bg-white px-4 py-2.5 text-sm text-[#3d332d] outline-none transition placeholder:text-[#9e8e84] focus:border-[#d46f49]/50 focus:ring-2 focus:ring-[#d46f49]/12 disabled:opacity-50";

const labelClass = "block text-sm font-medium text-[#5f4c41] mb-1";

const errorClass = "mt-1.5 text-xs text-[#a84632]";

function BlockTitle({ children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="flex-shrink-0 w-[3px] h-5 rounded-full bg-[#d46f49]" />
      <h2 className="font-editorial text-[1.2rem] text-[#d46f49] leading-none">
        {children}
      </h2>
    </div>
  );
}

function FieldGroup({ label, required, error, hint, children }) {
  return (
    <div>
      {label && (
        <label className={labelClass}>
          {label}
          {required && <span className="text-[#d46f49] ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-[0.78rem] text-[#9e8e84] italic">{hint}</p>}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

function CollabCheckbox({ value, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer rounded-[0.6rem] px-3 py-2.5 transition hover:bg-[#fbf0e8] select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 min-w-4 cursor-pointer rounded accent-[#d46f49]"
      />
      <span className="text-sm text-[#5f4c41] leading-tight">{label}</span>
    </label>
  );
}

function DetailCard({ forma, label, campo, opciones, detalle, onToggleOpcion, onChangeObs }) {
  const desc = DESCRIPCIONES_FORMA[forma];
  return (
    <div className="border border-[#e8c4a8] rounded-[0.7rem] overflow-hidden mb-3 animate-[fadeSlide_0.18s_ease]">
      <div className="bg-[#fbf0e8] border-b border-[#e8c4a8] px-4 py-2.5 flex items-center gap-3">
        <span className="bg-[#d46f49] text-white text-[0.67rem] font-semibold px-2.5 py-0.5 rounded-full tracking-wide flex-shrink-0">
          {label}
        </span>
        <span className="text-[0.82rem] text-[#4a3728] font-medium">
          Detalle del {label.toLowerCase()} que podrías ofrecer
        </span>
      </div>
      <div className="p-4 space-y-3">
        {desc && (
          <p className="text-[0.8rem] text-[#9e8e84] italic leading-relaxed">{desc}</p>
        )}
        {opciones.length > 0 && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            {opciones.map((op) => (
              <label
                key={op.value}
                className="flex items-start gap-2 cursor-pointer rounded-[0.5rem] px-2 py-1.5 transition hover:bg-[#fbf0e8] select-none"
              >
                <input
                  type="checkbox"
                  checked={detalle.opciones.includes(op.value)}
                  onChange={() => onToggleOpcion(campo, op.value)}
                  className="h-4 w-4 min-w-4 mt-0.5 cursor-pointer rounded accent-[#d46f49]"
                />
                <span className="text-[0.85rem] text-[#5f4c41] leading-tight">{op.label}</span>
              </label>
            ))}
          </div>
        )}
        <div>
          <label className={labelClass}>Observaciones</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={2}
            value={detalle.observaciones}
            onChange={(e) => onChangeObs(campo, e.target.value)}
            placeholder="Aclaraciones sobre esta forma de colaboración..."
          />
        </div>
      </div>
    </div>
  );
}

// ── componente principal ──────────────────────────────────────────────────────

const ColaboradoresForm = () => {
  const [form, setForm] = useState(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  const setField = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.aceptaTerminos || enviando) return;

    setEnviando(true);
    setErrores({});
    try {
      await colaboradoresService.registrar(buildPayload(form));
      setExito(true);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) {
        setErrores(err.response.data?.errors || {});
      } else if (status === 429) {
        setErrores({ _general: "Demasiados intentos. Intentá más tarde." });
      } else {
        setErrores({ _general: "Error al enviar. Intentá de nuevo." });
      }
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="rounded-[1.1rem] border border-[#2f241d]/10 bg-[#fffaf4] px-8 py-14 text-center">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#816959]">
          ¡Registro exitoso!
        </p>
        <h2 className="font-editorial mt-4 text-[2rem] text-[#241914]">
          ¡Gracias por sumarte a la red!
        </h2>
        <p className="mt-3 text-[0.96rem] text-[#5f4c41]">
          Nos comunicaremos cuando haya una oportunidad de colaborar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {errores._general && (
        <p className="mb-5 rounded-[0.7rem] bg-red-50 px-4 py-3 text-sm text-[#a84632]">
          {errores._general}
        </p>
      )}

      {/* Sobre vos */}
      <div className={blockClass}>
        <BlockTitle>Sobre vos</BlockTitle>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FieldGroup label="Nombre y apellido" required error={errores.nombre}>
            <input
              className={inputClass}
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
              placeholder="Tu nombre completo"
            />
          </FieldGroup>
          <FieldGroup label="Teléfono / WhatsApp" required error={errores.telefono}>
            <input
              className={inputClass}
              type="tel"
              value={form.telefono}
              onChange={(e) => setField("telefono", e.target.value)}
              placeholder="Ej: 381 555-1234"
            />
          </FieldGroup>
        </div>

        <div className="mb-4">
          <FieldGroup label="Email">
            <input
              className={inputClass}
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="tu@email.com"
            />
          </FieldGroup>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FieldGroup label="Localidad" required error={errores.localidad}>
            <select
              className={inputClass}
              value={form.localidad}
              onChange={(e) => setField("localidad", e.target.value)}
            >
              <option value="">Seleccioná tu zona...</option>
              {LOCALIDADES_TUCUMAN.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup label="Barrio o zona" required error={errores.barrio}>
            <input
              className={inputClass}
              value={form.barrio}
              onChange={(e) => setField("barrio", e.target.value)}
              placeholder="Ej: Villa Urquiza, Centro..."
            />
          </FieldGroup>
        </div>

        <FieldGroup
          label="Referencia de ubicación"
          hint="No hace falta la dirección exacta, solo una referencia útil."
        >
          <input
            className={inputClass}
            value={form.direccionReferencia}
            onChange={(e) => setField("direccionReferencia", e.target.value)}
            placeholder="Ej: cerca de Plaza Independencia, zona Av. Alem y Roca"
          />
        </FieldGroup>
      </div>

      {/* Cómo querés ayudar */}
      <div className={blockClass}>
        <BlockTitle>¿Cómo querés ayudar?</BlockTitle>

        <div className="bg-[#fbf0e8] border-l-[3px] border-[#d46f49] rounded-r-[0.5rem] px-4 py-3 mb-4 text-sm text-[#5f4c41] leading-relaxed">
          <strong className="text-[#d46f49]">Leé con atención antes de marcar.</strong>{" "}
          Podés elegir más de una opción. Al seleccionar cada una, se despliega un
          detalle específico — leelo y marcá lo que aplique a tu situación.
        </div>

        {errores.formasColaboracion && (
          <p className={`${errorClass} mb-3`}>{errores.formasColaboracion}</p>
        )}

        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {FORMAS_COLABORACION.map(({ value, label }) => {
            const activa = form.formasColaboracion.includes(value);
            const campo = DETALLE_CAMPO[value];
            const opciones = OPCIONES_DETALLE[value] || [];
            return (
              <Fragment key={value}>
                <CollabCheckbox
                  value={value}
                  label={label}
                  checked={activa}
                  onChange={() => setForm((prev) => toggleForma(prev, value))}
                />
                {activa && (
                  <div className="col-span-2 mt-1">
                    <DetailCard
                      forma={value}
                      label={label}
                      campo={campo}
                      opciones={opciones}
                      detalle={form[campo]}
                      onToggleOpcion={(c, op) =>
                        setForm((prev) => toggleOpcionDetalle(prev, c, op))
                      }
                      onChangeObs={(c, val) =>
                        setForm((prev) => ({
                          ...prev,
                          [c]: { ...prev[c], observaciones: val },
                        }))
                      }
                    />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Disponibilidad */}
      <div className={blockClass}>
        <BlockTitle>Disponibilidad</BlockTitle>

        <div className="mb-5">
          <p className={labelClass}>
            ¿En qué situaciones podrías colaborar?
            <span className="text-[#d46f49] ml-0.5">*</span>
          </p>
          <div className="mt-1 space-y-0.5">
            {Object.entries(LABELS_DISPONIBILIDAD).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2.5 cursor-pointer rounded-[0.6rem] px-3 py-2 transition hover:bg-[#fbf0e8] select-none"
              >
                <input
                  type="radio"
                  name="disponibilidadGeneral"
                  value={value}
                  checked={form.disponibilidadGeneral === value}
                  onChange={() => setField("disponibilidadGeneral", value)}
                  className="mt-0.5 cursor-pointer accent-[#d46f49]"
                />
                <span className="text-sm text-[#5f4c41]">{label}</span>
              </label>
            ))}
          </div>
          {errores.disponibilidadGeneral && (
            <p className={errorClass}>{errores.disponibilidadGeneral}</p>
          )}
        </div>

        <div className="border-t border-[#2f241d]/8 pt-4">
          <p className={labelClass}>¿En qué momentos solés tener disponibilidad?</p>
          <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
            {Object.entries(LABELS_MOMENTOS).map(([value, label]) => {
              const sel = form.momentosDisponibilidad.includes(value);
              return (
                <label
                  key={value}
                  className="flex items-center gap-2.5 cursor-pointer rounded-[0.6rem] px-3 py-2 transition hover:bg-[#fbf0e8] select-none"
                >
                  <input
                    type="checkbox"
                    checked={sel}
                    onChange={() => {
                      const nuevos = sel
                        ? form.momentosDisponibilidad.filter((m) => m !== value)
                        : [...form.momentosDisponibilidad, value];
                      setField("momentosDisponibilidad", nuevos);
                    }}
                    className="h-4 w-4 cursor-pointer rounded accent-[#d46f49]"
                  />
                  <span className="text-sm text-[#5f4c41]">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className={blockClass}>
        <BlockTitle>Contacto y grupos de acción</BlockTitle>

        <div className="space-y-1">
          {[
            {
              campo: "aceptaContactoWhatsapp",
              texto: (
                <>
                  <strong>Acepto ser contactado/a por WhatsApp</strong> por el equipo
                  de Perdidos y Adopciones ante situaciones relacionadas con mi zona o
                  tipo de ayuda ofrecida.
                </>
              ),
            },
            {
              campo: "quiereGruposWhatsapp",
              texto: "Quiero formar parte de grupos de WhatsApp organizados por zona o tipo de colaboración.",
            },
            {
              campo: "prefiereContactoIndividual",
              texto: "Prefiero que me contacten de manera individual antes de sumarme a un grupo.",
            },
          ].map(({ campo, texto }) => (
            <label
              key={campo}
              className="flex items-start gap-2.5 cursor-pointer rounded-[0.6rem] px-3 py-2.5 transition hover:bg-[#fbf0e8] select-none"
            >
              <input
                type="checkbox"
                checked={form[campo]}
                onChange={(e) => setField(campo, e.target.checked)}
                className="h-4 w-4 min-w-4 mt-0.5 cursor-pointer rounded accent-[#d46f49]"
              />
              <span className="text-sm text-[#5f4c41] leading-relaxed">{texto}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Campo libre */}
      <div className={blockClass}>
        <BlockTitle>Algo más que quieras contarnos</BlockTitle>
        <textarea
          className={`${inputClass} resize-none`}
          rows={4}
          value={form.observacionesFinales}
          onChange={(e) => setField("observacionesFinales", e.target.value)}
          placeholder="Podés aclarar condiciones, límites, experiencia previa, disponibilidad especial, si tenés animales en casa, movilidad, espacio disponible, etc."
        />
      </div>

      {/* Consentimiento + envío */}
      <div className="bg-[#eef4ee] border border-[#c8d8c9] rounded-[1.1rem] p-6">
        <p className="text-[0.82rem] text-[#9e8e84] leading-relaxed mb-4">
          Al enviar este formulario, aceptás que tus datos sean utilizados únicamente
          para organizar acciones solidarias dentro de la red de Perdidos y Adopciones.
          Podés solicitar la modificación o eliminación de tus datos cuando lo desees.
        </p>
        <label className="flex items-start gap-2.5 cursor-pointer rounded-[0.6rem] px-2 py-2 transition hover:bg-[rgba(107,138,111,0.1)] select-none mb-5">
          <input
            type="checkbox"
            checked={form.aceptaTerminos}
            onChange={(e) => setField("aceptaTerminos", e.target.checked)}
            className="h-4 w-4 min-w-4 mt-0.5 cursor-pointer rounded accent-[#5a7a5e]"
          />
          <span className="text-sm text-[#5f4c41]">
            <strong>Acepto el uso de mis datos para estos fines.</strong>{" "}
            <span className="text-[#d46f49]">*</span>
          </span>
        </label>
        {errores.aceptaTerminos && (
          <p className={`${errorClass} mb-3`}>{errores.aceptaTerminos}</p>
        )}

        <button
          type="submit"
          disabled={!form.aceptaTerminos || enviando}
          className="w-full rounded-[0.7rem] bg-[#d46f49] py-3.5 font-editorial text-[1.15rem] italic text-white transition hover:bg-[#c1622a] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {enviando ? "Enviando..." : "Quiero formar parte de la red"}
        </button>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </form>
  );
};

export default ColaboradoresForm;
