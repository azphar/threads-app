import React, { useState } from "react";

function ThreadForm({ onSubmit, loading }) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onSubmit(trimmed);
    setText("");
  }

  return (
    <form className="thread-form" onSubmit={handleSubmit}>
      <textarea
        className="thread-form__input"
        placeholder="Start a thread..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button className="thread-form__btn" type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

export default ThreadForm;
