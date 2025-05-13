import { motion } from "framer-motion";

const testimonials = [
  {
    content: "This platform has completely transformed how I manage my music students. The attendance tracking and progress monitoring features are invaluable.",
    author: "Sarah Johnson",
    role: "Music School Director",
    imageUrl: "/testimonial-1.jpg"
  },
  {
    content: "As a private guitar instructor, I&apos;ve been able to streamline my administrative tasks and focus more on teaching. The student management features are exactly what I needed.",
    author: "Michael Chen",
    role: "Guitar Instructor",
    imageUrl: "/testimonial-2.jpg"
  },
  {
    content: "The communication tools have made it so much easier to keep parents informed about their children&apos;s progress. It&apos;s been a game-changer for my teaching practice.",
    author: "Emma Rodriguez",
    role: "Piano Teacher",
    imageUrl: "/testimonial-3.jpg"
  }
];

export default function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32" id="testimonials">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Users Say
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Don&apos;t just take our word for it. Here&apos;s what educators are saying about our platform.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-50">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-indigo-600">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                      {testimonial.author}
                    </h3>
                    <p className="text-sm leading-6 text-indigo-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 