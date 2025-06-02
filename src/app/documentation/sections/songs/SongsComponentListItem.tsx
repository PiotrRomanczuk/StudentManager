import React from "react";

type Prop = { name: string; type: string; description: string };
type SongsComponentListItemProps = {
  name: string;
  file: string;
  description: string;
  props: Prop[];
};

const SongsComponentListItem = ({
  name,
  file,
  description,
  props,
}: SongsComponentListItemProps) => (
  <li>
    <b>{name}</b> <br />
    <span className="text-sm">
      File: <code>{file}</code>
    </span>
    <br />
    {description}
    <br />
    {props && props.length > 0 && (
      <>
        <b>Props:</b>
        <ul className="list-disc ml-6">
          {props.map((p) => (
            <li key={p.name}>
              <code>{p.name}</code>
              {p.type && ` (${p.type})`}: {p.description}
            </li>
          ))}
        </ul>
      </>
    )}
  </li>
);

export default SongsComponentListItem;
