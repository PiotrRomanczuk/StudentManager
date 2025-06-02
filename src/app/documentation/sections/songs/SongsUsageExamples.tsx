import React from "react";

const SongsUsageExamples = () => (
  <>
    <h3 className="text-xl font-semibold mb-2">Usage Example</h3>
    <pre className="bg-gray-100 rounded p-4 overflow-x-auto mb-4">
      <code>{`<SongsClientComponent songs={songs} isAdmin={isAdmin} />`}</code>
    </pre>
    <pre className="bg-gray-100 rounded p-4 overflow-x-auto mb-4">
      <code>{`<UserSelectWrapper profiles={profiles} selectedUserId={userId} />`}</code>
    </pre>
  </>
);

export default SongsUsageExamples;
