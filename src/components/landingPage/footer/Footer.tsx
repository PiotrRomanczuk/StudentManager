import React from "react";

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Copyright */}
        <div className="text-sm">
          © {new Date().getFullYear()} StudentManager. All rights reserved.
        </div>
        {/* Center: Navigation */}
        <nav className="flex gap-6 text-sm">
          <button
            onClick={() => scrollToSection("feature")}
            className="hover:text-white transition bg-transparent border-none cursor-pointer p-0 m-0 text-inherit"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("documentation")}
            className="hover:text-white transition bg-transparent border-none cursor-pointer p-0 m-0 text-inherit"
          >
            Documentation
          </button>
          <button
            onClick={() => scrollToSection("team")}
            className="hover:text-white transition bg-transparent border-none cursor-pointer p-0 m-0 text-inherit"
          >
            Team
          </button>
          {/* TODO: Add a section with id="contact" for this link to work */}
          <button
            onClick={() => scrollToSection("contact")}
            className="hover:text-white transition bg-transparent border-none cursor-pointer p-0 m-0 text-inherit"
          >
            Contact
          </button>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
