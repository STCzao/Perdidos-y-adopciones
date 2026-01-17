const Button = ({ text }) => (
  <button
    type="submit"
    className="mt-5 w-full h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-colors delay-100 duration-300"
  >
    {text}
  </button>
);

export default Button;
