import { useState } from "react";
import { colaboradoresService } from "../../services/colaboradores";
import { LOCALIDADES_TUCUMAN } from "../../utils/localidades";
import {
  DETALLE_CAMPO,
  FORMAS_COLABORACION,
  LABELS_DISPONIBILIDAD,
  LABELS_MOMENTOS,
  OPCIONES_DETALLE,
} from "../../utils/colaboradoresConstants";

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
        const campos = err.response.data?.errors || {};
        setErrores(campos);
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

  const sectionClass =
    "space-y-4 rounded-[1.35rem] border border-[#2f241d]/10 bg-[rgba(255,250,244,0.98)] p-5 shadow-[0_16px_45px_rgba(57,42,31,0.08)]";
  const labelClass = "block text-sm font-semibold text-[#5f4c41]";
  const inputClass =
    "mt-1.5 w-full rounded-[0.9rem] border border-[#2f241d]/12 bg-white px-4 py-2.5 text-sm text-[#3d332d] outline-none transition placeholder:text-[#9e8e84] focus:border-[#d46f49]/45 focus:ring-2 focus:ring-[#d46f49]/15 disabled:opacity-50";
  const errorClass = "mt-1.5 text-xs text-[#a84632]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errores._general && (
        <p className="rounded-[0.9rem] bg-red-50 px-4 py-3 text-sm text-[#a84632]">
          {errores._general}
        </p>
      )}

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-[#271d17]">Tus datos</h2>

        <div>
          <label className={labelClass}>Nombre completo *</label>
          <input
            className={inputClass}
            value={form.nombre}
            onChange={(e) => setField("nombre", e.target.value)}
            placeholder="Tu nombre y apellido"
          />
          {errores.nombre && <p className={errorClass}>{errores.nombre}</p>}
        </div>

        <div>
          <label className={labelClass}>Teléfono / WhatsApp *</label>
          <input
            className={inputClass}
            type="tel"
            value={form.telefono}
            onChange={(e) => setField("telefono", e.target.value)}
            placeholder="Ej: 3812345678"
          />
          {errores.telefono && <p className={errorClass}>{errores.telefono}</p>}
        </div>

        <div>
          <label className={labelClass}>Email (opcional)</label>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label className={labelClass}>Localidad *</label>
          <select
            className={inputClass}
            value={form.localidad}
            onChange={(e) => setField("localidad", e.target.value)}
          >
            <option value="">Seleccioná tu localidad</option>
            {LOCALIDADES_TUCUMAN.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errores.localidad && <p className={errorClass}>{errores.localidad}</p>}
        </div>

        <div>
          <label className={labelClass}>Barrio *</label>
          <input
            className={inputClass}
            value={form.barrio}
            onChange={(e) => setField("barrio", e.target.value)}
            placeholder="Tu barrio o zona"
          />
          {errores.barrio && <p className={errorClass}>{errores.barrio}</p>}
        </div>

        <div>
          <label className={labelClass}>Referencia de dirección (opcional)</label>
          <input
            className={inputClass}
            value={form.direccionReferencia}
            onChange={(e) => setField("direccionReferencia", e.target.value)}
            placeholder="Ej: cerca del parque Avellaneda"
          />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-[#271d17]">¿Cómo querés colaborar? *</h2>
        <p className="text-sm text-[#5f4c41]">Podés elegir más de una opción.</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FORMAS_COLABORACION.map(({ value, label }) => {
            const activa = form.formasColaboracion.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => setForm((prev) => toggleForma(prev, value))}
                className={`touch-manipulation rounded-[0.9rem] border px-4 py-3 text-sm font-medium transition ${
                  activa
                    ? "border-[#d46f49] bg-[#d46f49]/10 text-[#d46f49]"
                    : "border-[#2f241d]/15 bg-white text-[#5f4c41] hover:bg-[#fffaf4]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errores.formasColaboracion && (
          <p className={errorClass}>{errores.formasColaboracion}</p>
        )}
      </section>

      {FORMAS_COLABORACION.filter(({ value }) =>
        form.formasColaboracion.includes(value)
      ).map(({ value, label }) => {
        const campo = DETALLE_CAMPO[value];
        const opciones = OPCIONES_DETALLE[value] || [];
        return (
          <section key={value} className={sectionClass}>
            <h2 className="text-lg font-semibold text-[#271d17]">Detalle: {label}</h2>

            {opciones.length > 0 && (
              <div>
                <p className={labelClass}>¿En qué específicamente?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {opciones.map((op) => {
                    const seleccionada = form[campo].opciones.includes(op.value);
                    return (
                      <button
                        key={op.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => toggleOpcionDetalle(prev, campo, op.value))
                        }
                        className={`touch-manipulation rounded-[0.7rem] border px-3 py-1.5 text-xs font-medium transition ${
                          seleccionada
                            ? "border-[#d46f49] bg-[#d46f49]/10 text-[#d46f49]"
                            : "border-[#2f241d]/15 bg-white text-[#5f4c41] hover:bg-[#fffaf4]"
                        }`}
                      >
                        {op.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>Observaciones (opcional)</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                value={form[campo].observaciones}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [campo]: { ...prev[campo], observaciones: e.target.value },
                  }))
                }
                placeholder="Aclaraciones sobre esta forma de colaboración..."
              />
            </div>
          </section>
        );
      })}

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-[#271d17]">Disponibilidad *</h2>

        <div>
          <label className={labelClass}>Nivel de disponibilidad general</label>
          <div className="mt-2 space-y-2">
            {Object.entries(LABELS_DISPONIBILIDAD).map(([value, label]) => (
              <label key={value} className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="disponibilidadGeneral"
                  value={value}
                  checked={form.disponibilidadGeneral === value}
                  onChange={() => setField("disponibilidadGeneral", value)}
                  className="mt-0.5 accent-[#d46f49]"
                />
                <span className="text-sm text-[#5f4c41]">{label}</span>
              </label>
            ))}
          </div>
          {errores.disponibilidadGeneral && (
            <p className={errorClass}>{errores.disponibilidadGeneral}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>¿En qué momentos? (opcional)</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(LABELS_MOMENTOS).map(([value, label]) => {
              const sel = form.momentosDisponibilidad.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    const nuevos = sel
                      ? form.momentosDisponibilidad.filter((m) => m !== value)
                      : [...form.momentosDisponibilidad, value];
                    setField("momentosDisponibilidad", nuevos);
                  }}
                  className={`touch-manipulation rounded-[0.7rem] border px-3 py-1.5 text-xs font-medium transition ${
                    sel
                      ? "border-[#d46f49] bg-[#d46f49]/10 text-[#d46f49]"
                      : "border-[#2f241d]/15 bg-white text-[#5f4c41] hover:bg-[#fffaf4]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-[#271d17]">Preferencias de contacto</h2>

        {[
          {
            campo: "aceptaContactoWhatsapp",
            texto: "Acepto ser contactado/a por WhatsApp",
          },
          {
            campo: "quiereGruposWhatsapp",
            texto: "Me interesa ser parte de grupos de WhatsApp de la red",
          },
          {
            campo: "prefiereContactoIndividual",
            texto: "Prefiero ser contactado/a individualmente (no en grupos)",
          },
        ].map(({ campo, texto }) => (
          <label key={campo} className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form[campo]}
              onChange={(e) => setField(campo, e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded accent-[#5a3f35]"
            />
            <span className="text-sm text-[#5f4c41]">{texto}</span>
          </label>
        ))}
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-[#271d17]">¿Algo más que quieras contarnos?</h2>
        <textarea
          className={`${inputClass} resize-none`}
          rows={4}
          value={form.observacionesFinales}
          onChange={(e) => setField("observacionesFinales", e.target.value)}
          placeholder="Cualquier información adicional que quieras compartir..."
        />
      </section>

      <section className={sectionClass}>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.aceptaTerminos}
            onChange={(e) => setField("aceptaTerminos", e.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-[#5a3f35]"
          />
          <span className="text-sm text-[#5f4c41]">
            Acepto que mis datos sean utilizados para coordinar acciones de ayuda animal
            en la red de Perdidos y Adopciones Tucumán.
          </span>
        </label>
        {errores.aceptaTerminos && <p className={errorClass}>{errores.aceptaTerminos}</p>}

        <button
          type="submit"
          disabled={!form.aceptaTerminos || enviando}
          className="mt-2 w-full cursor-pointer rounded-full bg-[#2a1f19] py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#3a2c24] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? "Enviando..." : "Registrarme como colaborador/a"}
        </button>
      </section>
    </form>
  );
};

export default ColaboradoresForm;
