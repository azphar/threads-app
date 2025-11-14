import React from "react";
import "./SkeletonThreadCard.css";

function SkeletonThreadCard() {
  return (
    <article className="skeleton-thread-card">
      <div className="skeleton-thread-card__header">
        <div className="skeleton skeleton--avatar" />
        <div className="skeleton skeleton--line skeleton--line-short" />
      </div>

      <div className="skeleton-thread-card__body">
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--line-short" />
      </div>
    </article>
  );
}

export default SkeletonThreadCard;
