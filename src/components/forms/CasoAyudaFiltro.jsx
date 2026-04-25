const CasoAyudaFiltro = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar por autor"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full max-w-md rounded-full border border-white/18 bg-white/10 px-4 text-[0.88rem] text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#f4c89e]/60 sm:h-12 sm:px-5 sm:text-[0.95rem]"
    />
  );
};

export default CasoAyudaFiltro;
