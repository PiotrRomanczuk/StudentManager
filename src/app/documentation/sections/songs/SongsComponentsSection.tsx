import React from "react";
import SongsComponentList from "./SongsComponentList";
import SongsUsageExamples from "./SongsUsageExamples";
// import SongsNotes from "";

const SongsComponentsSection = () => (
  <section id="songs-components" className="mb-12">
    <h2 className="text-2xl font-bold mb-4">Songs Dashboard Components</h2>
    <p className="mb-4">
      This section documents the reusable React components for the Songs
      dashboard. These components handle displaying, searching, paginating, and
      managing songs, as well as user selection and error/loading states.
    </p>
    <SongsComponentList />
    <hr className="my-8" />
    <SongsUsageExamples />
    {/* <SongsNotes /> */}
  </section>
);

export default SongsComponentsSection;
