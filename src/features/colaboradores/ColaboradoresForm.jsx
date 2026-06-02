import { Fragment, useRef, useState } from "react";
import { colaboradoresService } from "../../services/colaboradores";
import { LOCALIDADES_TUCUMAN } from "../../utils/localidades";
import {
  CONDICIONES_ANIMAL_TRASLADO,
  DETALLE_CAMPO,
  DISPONIBILIDAD_TRASLADO,
  FORMAS_COLABORACION,
  LABELS_DISPONIBILIDAD,
  LABELS_MOMENTOS,
  OPCIONES_DETALLE,
  PERIODOS_TRANSITO,
  PREFERENCIAS_TRANSITO,
  ZONAS_TRASLADO,
} from "../../utils/colaboradoresConstants";

const EMPTY_DETAIL_BY_FIELD = {
  detalleTransito: { preferencia: "", periodos: [], observaciones: "" },
  detalleTraslado: {
    zonas: [],
    disponibilidad: [],
    condicionAnimal: [],
    observaciones: "",
  },
  detalleAvistamiento: { opciones: [], observaciones: "" },
  detalleDifusion: { opciones: [], observaciones: "" },
  detalleCoordinacion: { opciones: [], observaciones: "" },
  detalleEconomico: { opciones: [], observaciones: "" },
};

const FORM_INICIAL = {
  nombre: "",
  telefono: "",
  email: "",
  localidad: "",
  barrio: "",
  direccionReferencia: "",
  formasColaboracion: [],
  ...EMPTY_DETAIL_BY_FIELD,
  disponibilidadGeneral: "",
  momentosDisponibilidad: [],
  aceptaContactoWhatsapp: false,
  quiereGruposWhatsapp: false,
  prefiereContactoIndividual: false,
  observacionesFinales: "",
  aceptaTerminos: false,
};

const DESCRIPCIONES_FORMA = {
  TRANSITO:
    "Podés ofrecer un espacio temporal para resguardar a un animal hasta resolver su situación.",
  TRASLADO:
    "Podés ayudar trasladando animales, alimento, insumos o colaboraciones.",
  AVISTAMIENTO:
    "Podés ayudar estando atento/a a casos cercanos y colaborando con información o búsqueda en tu zona.",
  DIFUSION:
    "Podés ayudar difundiendo publicaciones para aumentar las posibilidades de reencuentro o adopción.",
  COORDINACION:
    "Podés ayudar organizando información, conectando personas o haciendo seguimiento de casos.",
  ECONOMICA:
    "Podés colaborar con medicamentos, alimento, atención veterinaria o necesidades puntuales.",
};

const DETAIL_TEXT = {
  AVISTAMIENTO: {
    observationsLabel: "Horarios y aclaraciones",
    observationsPlaceholder: "Sumá horarios disponibles o cualquier aclaración útil.",
  },
  DIFUSION: {
    observationsLabel: "Aclaraciones",
    observationsPlaceholder: "Contanos si hay algo más que debamos tener en cuenta.",
  },
  ECONOMICA: {
    observationsLabel: "Aclaraciones",
    observationsPlaceholder: "Contanos si hay algo más que debamos tener en cuenta.",
  },
};

const ERROR_SCROLL_PRIORITY = [
  "nombre",
  "telefono",
  "localidad",
  "barrio",
  "formasColaboracion",
  "detalleTransitoPreferencia",
  "detalleTransitoPeriodos",
  "detalleTrasladoZonas",
  "detalleTrasladoDisponibilidad",
  "detalleTrasladoCondicionAnimal",
  "detalleAvistamiento",
  "detalleDifusion",
  "detalleCoordinacion",
  "detalleEconomico",
  "aceptaContactoWhatsapp",
  "aceptaTerminos",
];

const buildPayload = (form) => {
  const base = {
    nombre: form.nombre.trim(),
    telefono: form.telefono.trim(),
    localidad: form.localidad,
    barrio: form.barrio.trim(),
    formasColaboracion: form.formasColaboracion,
    aceptaContactoWhatsapp: form.aceptaContactoWhatsapp,
    quiereGruposWhatsapp: form.quiereGruposWhatsapp,
    prefiereContactoIndividual: form.prefiereContactoIndividual,
    aceptaTerminos: form.aceptaTerminos,
    ...(form.email.trim() && { email: form.email.trim() }),
    ...(form.direccionReferencia.trim() && {
      direccionReferencia: form.direccionReferencia.trim(),
    }),
    ...(form.observacionesFinales.trim() && {
      observacionesFinales: form.observacionesFinales.trim(),
    }),
    ...(form.disponibilidadGeneral && {
      disponibilidadGeneral: form.disponibilidadGeneral,
    }),
    ...(form.momentosDisponibilidad.length > 0 && {
      momentosDisponibilidad: form.momentosDisponibilidad,
    }),
  };

  form.formasColaboracion.forEach((forma) => {
    const campo = DETALLE_CAMPO[forma];
    base[campo] = form[campo];
  });

  return base;
};

const getEmptyDetail = (campo) => ({
  ...EMPTY_DETAIL_BY_FIELD[campo],
  ...(EMPTY_DETAIL_BY_FIELD[campo].periodos && {
    periodos: [...EMPTY_DETAIL_BY_FIELD[campo].periodos],
  }),
  ...(EMPTY_DETAIL_BY_FIELD[campo].zonas && {
    zonas: [...EMPTY_DETAIL_BY_FIELD[campo].zonas],
  }),
  ...(EMPTY_DETAIL_BY_FIELD[campo].disponibilidad && {
    disponibilidad: [...EMPTY_DETAIL_BY_FIELD[campo].disponibilidad],
  }),
  ...(EMPTY_DETAIL_BY_FIELD[campo].condicionAnimal && {
    condicionAnimal: [...EMPTY_DETAIL_BY_FIELD[campo].condicionAnimal],
  }),
  ...(EMPTY_DETAIL_BY_FIELD[campo].opciones && {
    opciones: [...EMPTY_DETAIL_BY_FIELD[campo].opciones],
  }),
});

const toggleForma = (form, forma) => {
  const yaEsta = form.formasColaboracion.includes(forma);
  const campo = DETALLE_CAMPO[forma];
  const nuevas = yaEsta
    ? form.formasColaboracion.filter((f) => f !== forma)
    : [...form.formasColaboracion, forma];

  return {
    ...form,
    formasColaboracion: nuevas,
    ...(yaEsta && { [campo]: getEmptyDetail(campo) }),
  };
};

const toggleArrayValue = (values, option) =>
  values.includes(option) ? values.filter((item) => item !== option) : [...values, option];

const validateForm = (form) => {
  const errors = {};

  if (!form.nombre.trim()) errors.nombre = "Contanos tu nombre y apellido.";
  if (!form.telefono.trim()) errors.telefono = "Necesitamos un teléfono o WhatsApp.";
  if (!form.localidad) errors.localidad = "Seleccioná tu localidad.";
  if (!form.barrio.trim()) errors.barrio = "Indicá tu barrio o zona.";
  if (form.formasColaboracion.length === 0) {
    errors.formasColaboracion = "Elegí al menos una forma de colaboración.";
  }
  if (!form.aceptaContactoWhatsapp) {
    errors.aceptaContactoWhatsapp =
      "Necesitamos tu permiso para poder contactarte por WhatsApp.";
  }
  if (!form.aceptaTerminos) {
    errors.aceptaTerminos = "Necesitamos tu aceptación para guardar este registro.";
  }

  if (form.formasColaboracion.includes("TRANSITO")) {
    if (!form.detalleTransito.preferencia) {
      errors.detalleTransitoPreferencia =
        "Elegí con qué animales podrías colaborar.";
    }
    if (form.detalleTransito.periodos.length === 0) {
      errors.detalleTransitoPeriodos =
        "Marcá al menos un período de tránsito.";
    }
  }

  if (form.formasColaboracion.includes("TRASLADO")) {
    if (form.detalleTraslado.zonas.length === 0) {
      errors.detalleTrasladoZonas = "Seleccioná al menos una zona de traslado.";
    }
    if (form.detalleTraslado.disponibilidad.length === 0) {
      errors.detalleTrasladoDisponibilidad =
        "Contanos en qué disponibilidad podrías ayudar.";
    }
    if (form.detalleTraslado.condicionAnimal.length === 0) {
      errors.detalleTrasladoCondicionAnimal =
        "Elegí en qué condición del animal podrías colaborar.";
    }
  }

  ["AVISTAMIENTO", "DIFUSION", "COORDINACION", "ECONOMICA"].forEach((forma) => {
    if (!form.formasColaboracion.includes(forma)) return;
    const campo = DETALLE_CAMPO[forma];
    if (form[campo].opciones.length === 0) {
      errors[campo] = "Elegí al menos una opción en este bloque.";
    }
  });

  return errors;
};

const blockClass =
  "bg-[#fffaf4] border border-[#2f241d]/10 rounded-[1.1rem] p-6 mb-5";

const inputClass =
  "w-full rounded-[0.7rem] border border-[#2f241d]/12 bg-white px-4 py-2.5 text-sm text-[#3d332d] outline-none transition placeholder:text-[#9e8e84] focus:border-[#d46f49]/50 focus:ring-2 focus:ring-[#d46f49]/12 disabled:opacity-50";

const labelClass = "block text-sm font-medium text-[#5f4c41] mb-1";

const errorClass = "mt-1.5 text-xs text-[#a84632]";

function BlockTitle({ children }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="h-5 w-[3px] flex-shrink-0 rounded-full bg-[#d46f49]" />
      <h2 className="font-editorial text-[1.2rem] leading-none text-[#d46f49]">
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
          {required && <span className="ml-0.5 text-[#d46f49]">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-[0.78rem] italic text-[#9e8e84]">{hint}</p>}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

function CollabCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2.5 rounded-[0.6rem] px-3 py-2.5 transition hover:bg-[#fbf0e8]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 min-w-4 cursor-pointer rounded accent-[#d46f49]"
      />
      <span className="text-sm leading-tight text-[#5f4c41]">{label}</span>
    </label>
  );
}

function CheckboxGrid({ options, values, onToggle }) {
  return (
    <div className="grid grid-cols-1 gap-x-2 gap-y-0.5 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer select-none items-start gap-2 rounded-[0.5rem] px-2 py-1.5 transition hover:bg-[#fbf0e8]"
        >
          <input
            type="checkbox"
            checked={values.includes(option.value)}
            onChange={() => onToggle(option.value)}
            className="mt-0.5 h-4 w-4 min-w-4 cursor-pointer rounded accent-[#d46f49]"
          />
          <span className="text-[0.85rem] leading-tight text-[#5f4c41]">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function DetailCard({ label, forma, children }) {
  return (
    <div className="mb-3 overflow-hidden rounded-[0.7rem] border border-[#e8c4a8] animate-[fadeSlide_0.18s_ease]">
      <div className="flex items-center gap-3 border-b border-[#e8c4a8] bg-[#fbf0e8] px-4 py-2.5">
        <span className="flex-shrink-0 rounded-full bg-[#d46f49] px-2.5 py-0.5 text-[0.67rem] font-semibold tracking-wide text-white">
          {label}
        </span>
        <span className="text-[0.82rem] font-medium text-[#4a3728]">
          {DESCRIPCIONES_FORMA[forma] || "Contanos un poco más sobre cómo podrías ayudar."}
        </span>
      </div>
      <div className="space-y-3 p-4">{children}</div>
    </div>
  );
}

function GenericDetailCard({
  forma,
  label,
  detalle,
  opciones,
  error,
  onToggleOpcion,
  onChangeObs,
}) {
  const detailCopy = DETAIL_TEXT[forma] || {};

  return (
    <DetailCard forma={forma} label={label}>
      <CheckboxGrid
        options={opciones}
        values={detalle.opciones}
        onToggle={onToggleOpcion}
      />
      {error && <p className={errorClass}>{error}</p>}
      <div>
        <label className={labelClass}>
          {detailCopy.observationsLabel || "Observaciones"}
        </label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          value={detalle.observaciones}
          onChange={(e) => onChangeObs(e.target.value)}
          placeholder={
            detailCopy.observationsPlaceholder ||
            "Aclaraciones sobre esta forma de colaboración..."
          }
        />
      </div>
    </DetailCard>
  );
}

function TransitoDetailCard({
  detalle,
  errores,
  onSetPreferencia,
  onTogglePeriodo,
  onChangeObs,
}) {
  return (
    <DetailCard forma="TRANSITO" label="Tránsito">
      <FieldGroup
        label="Prefiero"
        required
        error={errores.detalleTransitoPreferencia}
      >
        <select
          className={inputClass}
          value={detalle.preferencia}
          onChange={(e) => onSetPreferencia(e.target.value)}
        >
          <option value="">Seleccioná una opción...</option>
          {PREFERENCIAS_TRANSITO.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldGroup>

      <FieldGroup
        label="Período"
        required
        error={errores.detalleTransitoPeriodos}
      >
        <CheckboxGrid
          options={PERIODOS_TRANSITO}
          values={detalle.periodos}
          onToggle={onTogglePeriodo}
        />
      </FieldGroup>

      <div>
        <label className={labelClass}>Observaciones</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          value={detalle.observaciones}
          onChange={(e) => onChangeObs(e.target.value)}
          placeholder='Ej: "tengo patio", "solo animales pequeños", etc.'
        />
      </div>
    </DetailCard>
  );
}

function TrasladoDetailCard({
  detalle,
  errores,
  onToggleZona,
  onToggleDisponibilidad,
  onToggleCondicionAnimal,
  onChangeObs,
}) {
  return (
    <DetailCard forma="TRASLADO" label="Traslado">
      <FieldGroup
        label="Zona"
        required
        error={errores.detalleTrasladoZonas}
      >
        <CheckboxGrid
          options={ZONAS_TRASLADO}
          values={detalle.zonas}
          onToggle={onToggleZona}
        />
      </FieldGroup>

      <FieldGroup
        label="Disponibilidad"
        required
        error={errores.detalleTrasladoDisponibilidad}
      >
        <CheckboxGrid
          options={DISPONIBILIDAD_TRASLADO}
          values={detalle.disponibilidad}
          onToggle={onToggleDisponibilidad}
        />
      </FieldGroup>

      <FieldGroup
        label="Condición para trasladar el animal"
        required
        error={errores.detalleTrasladoCondicionAnimal}
      >
        <CheckboxGrid
          options={CONDICIONES_ANIMAL_TRASLADO}
          values={detalle.condicionAnimal}
          onToggle={onToggleCondicionAnimal}
        />
      </FieldGroup>

      <div>
        <label className={labelClass}>Observaciones</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          value={detalle.observaciones}
          onChange={(e) => onChangeObs(e.target.value)}
          placeholder="Podés aclarar distancias, horarios o condiciones para coordinar mejor."
        />
      </div>
    </DetailCard>
  );
}

const ColaboradoresForm = () => {
  const [form, setForm] = useState(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);
  const topRef = useRef(null);
  const aboutRef = useRef(null);
  const colaboracionRef = useRef(null);
  const contactoRef = useRef(null);
  const terminosRef = useRef(null);

  const scrollToRef = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollWindowToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFirstError = (validationErrors) => {
    const firstErrorKey =
      ERROR_SCROLL_PRIORITY.find((key) => validationErrors[key]) ||
      Object.keys(validationErrors)[0];

    if (!firstErrorKey) return;

    if (["nombre", "telefono", "localidad", "barrio"].includes(firstErrorKey)) {
      scrollToRef(aboutRef);
      return;
    }

    if (
      [
        "formasColaboracion",
        "detalleTransitoPreferencia",
        "detalleTransitoPeriodos",
        "detalleTrasladoZonas",
        "detalleTrasladoDisponibilidad",
        "detalleTrasladoCondicionAnimal",
        "detalleAvistamiento",
        "detalleDifusion",
        "detalleCoordinacion",
        "detalleEconomico",
      ].includes(firstErrorKey)
    ) {
      scrollToRef(colaboracionRef);
      return;
    }

    if (firstErrorKey === "aceptaContactoWhatsapp") {
      scrollToRef(contactoRef);
      return;
    }

    if (firstErrorKey === "aceptaTerminos") {
      scrollToRef(terminosRef);
      return;
    }

    scrollWindowToTop();
  };

  const setField = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => {
      if (!prev[campo]) return prev;
      const next = { ...prev };
      delete next[campo];
      return next;
    });
  };

  const setDetailField = (campo, key, value) => {
    setForm((prev) => ({
      ...prev,
      [campo]: {
        ...prev[campo],
        [key]: value,
      },
    }));
  };

  const clearErrors = (...keys) => {
    setErrores((prev) => {
      const next = { ...prev };
      let changed = false;
      keys.forEach((key) => {
        if (next[key]) {
          delete next[key];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrores(validationErrors);
      scrollToFirstError(validationErrors);
      return;
    }

    setEnviando(true);
    setErrores({});
    try {
      await colaboradoresService.registrar(buildPayload(form));
      setExito(true);
      scrollWindowToTop();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) {
        const backendErrors = err.response.data?.errors || {};
        setErrores(backendErrors);
        scrollToFirstError(backendErrors);
      } else if (status === 429) {
        setErrores({ _general: "Demasiados intentos. Intentá más tarde." });
      } else {
        setErrores({ _general: "Error al enviar. Intentá de nuevo." });
      }
      if (status !== 400) {
        scrollWindowToTop();
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
          ¡Gracias por sumarte a la comunidad solidaria!
        </h2>
        <p className="mt-3 text-[0.96rem] text-[#5f4c41]">
          Te vamos a contactar cuando haya una oportunidad para colaborar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div ref={topRef} />
      {errores._general && (
        <p className="mb-5 rounded-[0.7rem] bg-red-50 px-4 py-3 text-sm text-[#a84632]">
          {errores._general}
        </p>
      )}

      <div ref={aboutRef} className={blockClass}>
        <BlockTitle>Sobre vos</BlockTitle>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div ref={colaboracionRef} className={blockClass}>
        <BlockTitle>¿Cómo querés ayudar?</BlockTitle>

        <div className="mb-4 rounded-r-[0.5rem] border-l-[3px] border-[#d46f49] bg-[#fbf0e8] px-4 py-3 text-sm leading-relaxed text-[#5f4c41]">
          <strong className="text-[#d46f49]">Podés elegir más de una opción.</strong>{" "}
          Al seleccionar cada una, se despliega un bloque con lo necesario para
          entender mejor cómo te gustaría colaborar.
        </div>

        {errores.formasColaboracion && (
          <p className={`${errorClass} mb-3`}>{errores.formasColaboracion}</p>
        )}

        <div className="grid grid-cols-1 gap-x-2 gap-y-1 sm:grid-cols-2">
          {FORMAS_COLABORACION.map(({ value, label }) => {
            const activa = form.formasColaboracion.includes(value);
            const campo = DETALLE_CAMPO[value];
            const opciones = OPCIONES_DETALLE[value] || [];

            return (
              <Fragment key={value}>
                <CollabCheckbox
                  label={label}
                  checked={activa}
                  onChange={() => {
                    setForm((prev) => toggleForma(prev, value));
                    clearErrors(
                      "formasColaboracion",
                      campo,
                      "detalleTransitoPreferencia",
                      "detalleTransitoPeriodos",
                      "detalleTrasladoZonas",
                      "detalleTrasladoDisponibilidad",
                      "detalleTrasladoCondicionAnimal",
                    );
                  }}
                />
                {activa && (
                  <div className="sm:col-span-2">
                    {value === "TRANSITO" ? (
                      <TransitoDetailCard
                        detalle={form.detalleTransito}
                        errores={errores}
                        onSetPreferencia={(newValue) => {
                          setDetailField("detalleTransito", "preferencia", newValue);
                          clearErrors("detalleTransitoPreferencia");
                        }}
                        onTogglePeriodo={(periodo) => {
                          setDetailField(
                            "detalleTransito",
                            "periodos",
                            toggleArrayValue(form.detalleTransito.periodos, periodo),
                          );
                          clearErrors("detalleTransitoPeriodos");
                        }}
                        onChangeObs={(newValue) =>
                          setDetailField("detalleTransito", "observaciones", newValue)
                        }
                      />
                    ) : value === "TRASLADO" ? (
                      <TrasladoDetailCard
                        detalle={form.detalleTraslado}
                        errores={errores}
                        onToggleZona={(option) => {
                          setDetailField(
                            "detalleTraslado",
                            "zonas",
                            toggleArrayValue(form.detalleTraslado.zonas, option),
                          );
                          clearErrors("detalleTrasladoZonas");
                        }}
                        onToggleDisponibilidad={(option) => {
                          setDetailField(
                            "detalleTraslado",
                            "disponibilidad",
                            toggleArrayValue(form.detalleTraslado.disponibilidad, option),
                          );
                          clearErrors("detalleTrasladoDisponibilidad");
                        }}
                        onToggleCondicionAnimal={(option) => {
                          setDetailField(
                            "detalleTraslado",
                            "condicionAnimal",
                            toggleArrayValue(form.detalleTraslado.condicionAnimal, option),
                          );
                          clearErrors("detalleTrasladoCondicionAnimal");
                        }}
                        onChangeObs={(newValue) =>
                          setDetailField("detalleTraslado", "observaciones", newValue)
                        }
                      />
                    ) : (
                      <GenericDetailCard
                        forma={value}
                        label={label}
                        detalle={form[campo]}
                        opciones={opciones}
                        error={errores[campo]}
                        onToggleOpcion={(option) => {
                          setDetailField(
                            campo,
                            "opciones",
                            toggleArrayValue(form[campo].opciones, option),
                          );
                          clearErrors(campo);
                        }}
                        onChangeObs={(newValue) =>
                          setDetailField(campo, "observaciones", newValue)
                        }
                      />
                    )}
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div ref={contactoRef} className={blockClass}>
        <BlockTitle>Disponibilidad</BlockTitle>

        <div className="mb-5">
          <p className={labelClass}>¿En qué situaciones podrías colaborar?</p>
          <div className="mt-1 space-y-0.5">
            {Object.entries(LABELS_DISPONIBILIDAD).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer select-none items-center gap-2.5 rounded-[0.6rem] px-3 py-2 transition hover:bg-[#fbf0e8]"
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
        </div>

        <div className="border-t border-[#2f241d]/8 pt-4">
          <p className={labelClass}>¿En qué momentos solés tener disponibilidad?</p>
          <div className="mt-1 grid grid-cols-1 gap-x-2 gap-y-0.5 sm:grid-cols-2">
            {Object.entries(LABELS_MOMENTOS).map(([value, label]) => {
              const selected = form.momentosDisponibilidad.includes(value);
              return (
                <label
                  key={value}
                  className="flex cursor-pointer select-none items-center gap-2.5 rounded-[0.6rem] px-3 py-2 transition hover:bg-[#fbf0e8]"
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      setField(
                        "momentosDisponibilidad",
                        toggleArrayValue(form.momentosDisponibilidad, value),
                      )
                    }
                    className="h-4 w-4 cursor-pointer rounded accent-[#d46f49]"
                  />
                  <span className="text-sm text-[#5f4c41]">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

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
              texto:
                "Quiero formar parte de grupos de WhatsApp organizados por zona o tipo de colaboración.",
            },
            {
              campo: "prefiereContactoIndividual",
              texto:
                "Prefiero que me contacten de manera individual antes de sumarme a un grupo.",
            },
          ].map(({ campo, texto }) => (
            <label
              key={campo}
              className="flex cursor-pointer select-none items-start gap-2.5 rounded-[0.6rem] px-3 py-2.5 transition hover:bg-[#fbf0e8]"
            >
              <input
                type="checkbox"
                checked={form[campo]}
                onChange={(e) => {
                  setField(campo, e.target.checked);
                  if (campo === "aceptaContactoWhatsapp") {
                    clearErrors("aceptaContactoWhatsapp");
                  }
                }}
                className="mt-0.5 h-4 w-4 min-w-4 cursor-pointer rounded accent-[#d46f49]"
              />
              <span className="text-sm leading-relaxed text-[#5f4c41]">{texto}</span>
            </label>
          ))}
        </div>

        {errores.aceptaContactoWhatsapp && (
          <p className={errorClass}>{errores.aceptaContactoWhatsapp}</p>
        )}
      </div>

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

      <div
        ref={terminosRef}
        className="rounded-[1.1rem] border border-[#c8d8c9] bg-[#eef4ee] p-6"
      >
        <p className="mb-4 text-[0.82rem] leading-relaxed text-[#5f4c41]">
          Al enviar este formulario, aceptás que tus datos sean utilizados
          únicamente para organizar acciones solidarias dentro de la comunidad de
          Perdidos y Adopciones. Podés solicitar la modificación o eliminación de
          tus datos cuando lo desees.
        </p>
        <label className="mb-5 flex cursor-pointer select-none items-start gap-2.5 rounded-[0.6rem] px-2 py-2 transition hover:bg-[rgba(107,138,111,0.1)]">
          <input
            type="checkbox"
            checked={form.aceptaTerminos}
            onChange={(e) => {
              setField("aceptaTerminos", e.target.checked);
              clearErrors("aceptaTerminos");
            }}
            className="mt-0.5 h-4 w-4 min-w-4 cursor-pointer rounded accent-[#5a7a5e]"
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
          disabled={enviando}
          className="w-full rounded-[0.7rem] bg-[#d46f49] py-3.5 font-editorial text-[1.15rem] italic text-white transition hover:bg-[#c1622a] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {enviando ? "Enviando..." : "Quiero formar parte de la comunidad"}
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
