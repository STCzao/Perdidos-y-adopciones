import { useState } from "react";
import { createPortal } from "react-dom";
import { Marker, useMapEvents } from "react-leaflet";
import ModalShell from "../../../components/ui/ModalShell";
import MapaBase from "../../../components/map/MapaBase";
import { TUCUMAN_CENTER } from "../../../components/map/mapConstants";
import { getTipoIcon } from "../../../components/map/leafletIcons";

const ClickParaUbicar = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
};

/**
 * Modal para elegir la ubicación del caso tocando el mapa. El pin se mueve con
 * otro click o arrastrándolo. Se monta solo mientras está abierto.
 */
const SelectorUbicacionMapa = ({ tipo, ubicacionInicial, onConfirmar, onCancelar }) => {
  const [pin, setPin] = useState(ubicacionInicial);

  const center = ubicacionInicial
    ? [ubicacionInicial.lat, ubicacionInicial.lng]
    : TUCUMAN_CENTER;

  // Portal a body: el formulario vive dentro de un motion.div con transform, que
  // rompería el `position: fixed` del ModalShell si se renderizara adentro.
  return createPortal(
    <ModalShell className="p-3 sm:p-5" elevated>
      <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[1.2rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] shadow-[0_28px_70px_rgba(36,25,20,0.24)]">
        <div className="px-5 pb-3 pt-4">
          <h2 className="text-lg font-semibold text-[#271d17]">Marcá la ubicación en el mapa</h2>
          <p className="mt-1 text-sm text-[#6d5a4f]">
            Tocá el mapa donde se perdió o encontró al animal. Podés mover el pin arrastrándolo
            o tocando otro punto.
          </p>
        </div>

        <MapaBase center={center} zoom={ubicacionInicial ? 16 : 13} className="min-h-0 flex-1">
          <ClickParaUbicar onSelect={setPin} />
          {pin && (
            <Marker
              position={[pin.lat, pin.lng]}
              icon={getTipoIcon(tipo)}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng();
                  setPin({ lat, lng });
                },
              }}
            />
          )}
        </MapaBase>

        <div className="flex flex-wrap justify-end gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onCancelar}
            className="cursor-pointer rounded-full border border-[#cbb9aa] bg-[#fff8f0] px-5 py-2.5 text-sm font-semibold text-[#4e3c31] transition-colors duration-200 hover:bg-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirmar(pin)}
            disabled={!pin}
            className="cursor-pointer rounded-full bg-[#2a1f19] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#3a2c24] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Confirmar ubicación
          </button>
        </div>
      </div>
    </ModalShell>,
    document.body,
  );
};

export default SelectorUbicacionMapa;
