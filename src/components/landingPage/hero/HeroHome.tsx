import Navbar from "../navbar/Navbar"

export default function HeroHome() {
  return (<section>
      <Navbar />
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Student Manager
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Transform your ideas into reality with our powerful tools and solutions.
            Start building something amazing today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div></section>
  );
}