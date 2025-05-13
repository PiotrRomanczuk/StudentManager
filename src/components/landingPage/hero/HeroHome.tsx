import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroHome() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      <div className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Streamline Your <span className="text-indigo-600">Student Management</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Effortlessly manage student records, track progress, and enhance communication with our comprehensive platform. Designed for educators who want to focus on teaching.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/auth/signup"
                  className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get Started Free
                </motion.a>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="#features"
                  className="text-lg font-semibold leading-6 text-gray-900"
                >
                  Learn More <span aria-hidden="true">→</span>
                </motion.a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/MOCKUP UI.png"
                  alt="Dashboard Preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-indigo-600/10 blur-3xl" />
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-purple-600/10 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
