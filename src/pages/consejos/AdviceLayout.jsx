import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const AdviceLayout = ({ eyebrow, title, description, accent, steps, closing }) => {
  return (
    <div className="bg-[#f6efe4] text-[#241914]">
      <Navbar />

      <div className="relative min-h-screen overflow-hidden px-4 pb-16 pt-30 sm:px-6 lg:px-8 lg:pt-32">
        <div
          className="pointer-events-none absolute left-[-8rem] top-36 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${accent}1F` }}
        />
        <div className="pointer-events-none absolute right-[-8rem] top-20 h-80 w-80 rounded-full bg-[#efe2d0]/70 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(90,63,53,0.12),transparent)]" />

        <div className="relative mx-auto max-w-6xl">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[1.1rem] border border-[#2f241d]/10 bg-[linear-gradient(135deg,rgba(255,250,244,0.96),rgba(239,226,208,0.92))] shadow-[0_28px_70px_rgba(36,25,20,0.08)]"
          >
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-7">
              <div className="max-w-3xl">
                <span
                  className="inline-flex rounded-[0.45rem] px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[#241914]"
                  style={{ backgroundColor: `${accent}20` }}
                >
                  {eyebrow}
                </span>
                <h1 className="font-editorial mt-4 text-[2.4rem] leading-[0.92] text-[#241914] sm:text-[3rem] lg:text-[3.5rem]">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-[0.96rem] leading-relaxed text-[#5f4c41]">
                  {description}
                </p>
              </div>

              <div className="self-start rounded-[0.9rem] border border-[#2f241d]/10 bg-white/72 p-4 shadow-sm">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#816959]">
                  Guia rapida
                </p>
                <p className="mt-3 text-[0.95rem] font-medium leading-relaxed text-[#5f4c41]">
                  Segui estos pasos como orientacion inicial y adapta cada decision al
                  estado real del animal y a la ayuda que tengas disponible.
                </p>
              </div>
            </div>
          </motion.section>

          <section className="mt-8 grid gap-5">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 * index }}
                className="rounded-[1rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(255,255,255,0.84))] p-5 shadow-[0_18px_40px_rgba(36,25,20,0.05)] sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.85rem] text-lg font-bold text-white shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-[1.15rem] font-semibold text-[#241914] sm:text-[1.25rem]">
                      {step.title}
                    </h2>

                    {step.text && (
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-[#5f4c41]">
                        {step.text}
                      </p>
                    )}

                    {step.bullets?.length > 0 && (
                      <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed text-[#4f4037]">
                        {step.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: accent }}
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </section>

          {closing && (
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-8 rounded-[1rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(36,25,20,0.92),rgba(54,39,32,0.94))] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,25,20,0.15)] sm:px-6"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/65">
                Recordatorio
              </p>
              <p className="mt-3 max-w-3xl text-[1rem] leading-relaxed text-white/86">
                {closing}
              </p>
            </motion.section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdviceLayout;
