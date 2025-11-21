import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Img_quehacer from "../../assets/Img_quehacer.png";

const AdoptarScreen = () => {
  return (
    <div>
      <Navbar />

      <div
        className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${Img_quehacer})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col justify-center items-center text-white/90 max-w-4xl mt-35 mb-15">
          <motion.p className="text-3xl mb-10 text-center">
            ¿Qué hacer si quiero adoptar o dar en adopción un animal?
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">1-</span>
            <span className="text-xl">¿Tiene chip?</span>
            <span>
              Si puedes, llévalo al veterinario para comprobar si tiene
              microchip. El microchip no se ve, por lo tanto para comprobar si
              lo tiene solo tienes que acudir a una clínica veterinaria. En
              caso, de que por los horarios estén cerradas, también tienen
              lectores de chip algunas protectoras. La lectura del chip es
              gratuita. En caso de que el animal lo tenga, será tan sencillo
              como llamar a la familia para que acuda a recogerlo.
            </span>
            <span>
              En caso de que no puedas desplazarte con el animal, intenta
              hacerle fotos con tu celular y anotar el punto exacto donde lo has
              visto. En caso de sospecha de que sea un animal perdido, puedes
              consultar anuncios en internet o locales, para poder avisar a los
              dueños si observas alguna coincidendia.
            </span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm mt-5 border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">2-</span>
            <span className="text-xl">¿No tiene chip?</span>

            <ul>
              <li>-Pega carteles por la zona donde lo encontraste.</li>
              <li>
                -Publica un aviso en foros y páginas de internet dedicadas
                animales perdidos. Puedes hacerlo aquí mismo en Perdidos y
                Adopciones.
              </li>
              <li>
                -Ponte en contacto con todas las protectoras o veterinarias de
                la zona pues puede que la familia del animal ya haya comunicado
                su desaparición.
              </li>
              <li>
                Recuerda que gracias a tus acciones puedes salvar la vida de un
                animal y hacer que se reencuentre con su familia.
              </li>
            </ul>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">3-</span>
            <span className="text-xl">No tiene chip y no aparece su dueño</span>
            <span>
              Ponte en contacto con una protectora o refugio para que te diga la
              forma y te ayude a encontrarle un nuevo hogar al animal. Sin duda,
              le habrás salvado la vida.
            </span>
          </motion.p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdoptarScreen