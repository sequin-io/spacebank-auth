import React from "react";
import "./FishyEmoji.css";

interface Props {
  withOpenAnim?: boolean;
}

export default function FishyEmoji({ withOpenAnim }: Props) {
  return (
    <div className={`fishy-emoji ${withOpenAnim ? "with-open-anim" : ""}`}>
      <span role="img" aria-label="Fish">
        🐟
      </span>
    </div>
  );
}
