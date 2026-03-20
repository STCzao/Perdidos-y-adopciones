const CasoAyudaFiltro = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar por creador..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 rounded-lg bg-white/5 border border-white text-white placeholder-white/50 focus:outline-none"
    />
  );
};

export default CasoAyudaFiltro;
