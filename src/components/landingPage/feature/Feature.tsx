import { features_list } from "./features_list";
import { motion } from "framer-motion";

export default function Feature() {
  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 py-24 sm:py-32" id="feature">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Powerful Features
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything You Need to Manage Students
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Streamline your educational administration with our powerful suite of tools. 
            From attendance tracking to grade management, we've got you covered.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features_list.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <dt className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="text-lg font-semibold leading-7 text-gray-900">
                    {feature.name}
                  </span>
                </dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
}
