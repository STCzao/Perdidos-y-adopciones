const CasoAyudaFiltro = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar por autor"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full max-w-md rounded-full border border-white/18 bg-white/10 px-5 text-[0.95rem] text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#f4c89e]/60"
    />
  );
};

export default CasoAyudaFiltro;
