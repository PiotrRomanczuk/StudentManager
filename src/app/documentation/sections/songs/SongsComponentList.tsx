import React from "react";
import SongsComponentListItem from "./SongsComponentListItem";

const componentItems = [
  {
    name: "ErrorComponent",
    file: "ErrorComponent.tsx",
    description:
      "Displays an error message and a 'Try Again' button, optionally calling a reload function.",
    props: [
      {
        name: "error",
        type: "string",
        description: "The error message to display.",
      },
      {
        name: "loadSongs?",
        type: "function",
        description: "Optional callback to reload songs.",
      },
    ],
  },
  {
    name: "LoadingComponent",
    file: "LoadingComponent.tsx",
    description: "Shows a loading message while data is being fetched.",
    props: [
      {
        name: "message",
        type: "string",
        description: "The loading message to display.",
      },
    ],
  },
  {
    name: "NoSongsFound",
    file: "NoSongsFound.tsx",
    description:
      "Simple component that displays a 'No songs found' message when the song list is empty.",
    props: [],
  },
  {
    name: "PaginationComponent",
    file: "PaginationComponent.tsx",
    description:
      "Renders pagination controls for navigating through pages of songs.",
    props: [
      {
        name: "currentPage",
        type: "number",
        description: "The current page number.",
      },
      {
        name: "totalPages",
        type: "number",
        description: "Total number of pages.",
      },
      {
        name: "onPageChange",
        type: "function",
        description: "Callback to change the page.",
      },
    ],
  },
  {
    name: "SongSearchBar",
    file: "SongSearchBar.tsx",
    description:
      "Provides a search input with a dropdown for filtering songs by title.",
    props: [
      {
        name: "songs",
        type: "Song[]",
        description: "List of songs to search.",
      },
      {
        name: "onSearch",
        type: "function",
        description: "Callback when the search query changes.",
      },
    ],
  },
  {
    name: "SongTable",
    file: "SongTable.tsx",
    description:
      "Displays a table of songs for desktop view, with sorting, actions (edit, delete, view), and status badges.",
    props: [
      {
        name: "See SongsTableProps in types/tableTypes.ts",
        type: "",
        description: "",
      },
    ],
  },
  {
    name: "SongTableRow",
    file: "SongTable.tsx (can be moved to its own file)",
    description:
      "Renders a single row in the song table, including status, title, author, key, level, updated date, and actions.",
    props: [
      { name: "song", type: "Song", description: "The song data for the row." },
      {
        name: "isAdmin?",
        type: "boolean",
        description: "Whether the current user is an admin.",
      },
      {
        name: "onEdit",
        type: "function",
        description: "Callback for edit action.",
      },
      {
        name: "onView",
        type: "function",
        description: "Callback for view action.",
      },
      {
        name: "onDelete",
        type: "function",
        description: "Callback for delete action.",
      },
    ],
  },
  {
    name: "SongTableActions",
    file: "SongTable.tsx (can be moved to its own file)",
    description:
      "Renders the action buttons (edit, delete, view) for a song row.",
    props: [
      { name: "song", type: "Song", description: "The song data for the row." },
      {
        name: "isAdmin?",
        type: "boolean",
        description: "Whether the current user is an admin.",
      },
      {
        name: "onEdit",
        type: "function",
        description: "Callback for edit action.",
      },
      {
        name: "onView",
        type: "function",
        description: "Callback for view action.",
      },
      {
        name: "onDelete",
        type: "function",
        description: "Callback for delete action.",
      },
    ],
  },
  {
    name: "SongTableMobile",
    file: "SongTableMobile.tsx",
    description:
      "Mobile-friendly version of the song table, with similar features as SongTable.",
    props: [
      {
        name: "See SongsTableProps in types/tableTypes.ts",
        type: "",
        description: "",
      },
    ],
  },
  {
    name: "SongsClientComponent",
    file: "SongsClientComponent.tsx",
    description:
      "Main client-side component that manages pagination, search, and renders the appropriate table (desktop/mobile).",
    props: [
      {
        name: "songs",
        type: "Song[]",
        description: "List of songs to display.",
      },
      {
        name: "isAdmin?",
        type: "boolean",
        description: "Whether the current user is an admin.",
      },
    ],
  },
  {
    name: "UserSelectDropdown",
    file: "UserSelectDropdown.tsx",
    description:
      "Dropdown for selecting a user (used by admins to filter songs by user).",
    props: [
      {
        name: "profiles",
        type: "Profile[]",
        description: "List of user profiles.",
      },
      {
        name: "selectedUserId",
        type: "string",
        description: "Currently selected user ID.",
      },
      {
        name: "onChange",
        type: "function",
        description: "Callback when the user selection changes.",
      },
    ],
  },
  {
    name: "UserSelectWrapper",
    file: "UserSelectWrapper.tsx",
    description:
      "Wraps UserSelectDropdown and syncs selection with URL query parameters.",
    props: [
      {
        name: "profiles",
        type: "Profile[]",
        description: "List of user profiles.",
      },
      {
        name: "selectedUserId",
        type: "string",
        description: "Currently selected user ID.",
      },
    ],
  },
  {
    name: "Constants and Hooks",
    file: "constants/tableConstants.ts, hooks/useSongTable.ts, types/tableTypes.ts",
    description: "Constants, hooks, and types for the table.",
    props: [{ name: "See files for details", type: "", description: "" }],
  },
];

const SongsComponentList = () => (
  <ol className="list-decimal ml-6 space-y-4">
    {componentItems.map((item) => (
      <SongsComponentListItem key={item.name} {...item} />
    ))}
  </ol>
);

export default SongsComponentList;
