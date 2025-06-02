"use client";
import { Menu, X } from "lucide-react";
import React from "react";

interface Section {
  id: string;
  label: string;
  children?: Section[];
}

interface DocumentationSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sections: Section[];
}

function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  id: string,
  closeSidebar?: () => void,
) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    if (closeSidebar) closeSidebar();
  }
}

const renderLinks = (
  sections: Section[],
  closeSidebar?: () => void,
  level: number = 0,
) =>
  sections.map((section) => (
    <React.Fragment key={section.id}>
      <a
        href={`#${section.id}`}
        onClick={(e) => handleSmoothScroll(e, section.id, closeSidebar)}
        className={`block py-2 px-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors${level > 0 ? " pl-6 text-sm" : ""}`}
        style={level > 0 ? { marginLeft: `${level * 12}px` } : {}}
      >
        {section.label}
      </a>
      {section.children &&
        renderLinks(section.children, closeSidebar, level + 1)}
    </React.Fragment>
  ));

const DocumentationSidebar: React.FC<DocumentationSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  sections,
}) => (
  <>
    {/* Desktop Sidebar */}
    <aside className="hidden lg:flex flex-col w-64 h-full fixed top-0 left-0 z-30 pt-24 bg-white border-r border-gray-200 shadow-sm">
      <nav className="flex-1 px-6 py-8 space-y-2">{renderLinks(sections)}</nav>
    </aside>
    {/* Mobile Sidebar */}
    <div className="lg:hidden">
      <button
        className="fixed top-20 left-4 z-40 p-2 rounded-md bg-white border border-gray-200 shadow-md lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Open documentation navigation"
      >
        <Menu className="h-6 w-6 text-indigo-700" />
      </button>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ paddingTop: "5rem" }}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-md text-gray-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
        <nav className="px-6 py-8 space-y-2">
          {renderLinks(sections, () => setSidebarOpen(false))}
        </nav>
      </aside>
    </div>
  </>
);

export default DocumentationSidebar;
