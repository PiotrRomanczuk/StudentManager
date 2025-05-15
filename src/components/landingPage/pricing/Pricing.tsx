import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/20/solid";

const tiers = [
  {
    name: "Solo Guitar Teacher",
    id: "tier-basic",
    price: { monthly: "$9" },
    description: "Perfect for individual guitar teachers just getting started.",
    features: [
      "Up to 20 students",
      "Basic lesson scheduling",
      "Guitar progress tracking",
      "Email support",
      "Basic repertoire management",
    ],
    featured: false,
  },
  {
    name: "Guitar Teaching Studio",
    id: "tier-professional",
    price: { monthly: "$29" },
    description: "Ideal for growing guitar teaching studios.",
    features: [
      "Up to 100 students",
      "Advanced lesson scheduling",
      "Detailed progress tracking",
      "Parent communication portal",
      "Advanced repertoire management",
      "Priority email support",
      "Custom branding",
    ],
    featured: true,
  },
  {
    name: "Music School",
    id: "tier-enterprise",
    price: { monthly: "$99" },
    description: "For established music schools with guitar programs.",
    features: [
      "Unlimited students",
      "Multi-teacher support",
      "Advanced analytics",
      "API access",
      "Custom integrations",
      "24/7 phone & email support",
      "Dedicated account manager",
      "Custom feature development",
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose the right plan for your needs
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Simple, transparent pricing that grows with your teaching practice.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-shadow duration-300 ${
                tier.featured ? "relative lg:z-10 lg:scale-105" : ""
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-indigo-600 px-3 py-1 text-center text-sm font-semibold text-white">
                  Most popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold leading-8 text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.price.monthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/auth/signup"
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.featured
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus-visible:outline-indigo-600"
                }`}
              >
                Get started today
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 