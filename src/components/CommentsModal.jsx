// src/components/CommentsModal.jsx
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/init.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./CommentsModal.css";

function CommentsModal({ threadId, onClose }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!threadId) return;

    const commentsRef = collection(db, "threads", threadId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(list);
    });

    return unsubscribe;
  }, [threadId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user) return;

    const trimmed = commentText.trim();
    if (!trimmed) return;

    const commentsRef = collection(db, "threads", threadId, "comments");

    try {
      await addDoc(commentsRef, {
        text: trimmed,
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  function handleOverlayClick() {
    onClose();
  }

  function stopPropagation(event) {
    event.stopPropagation();
  }

  return (
    <div className="comments-overlay" onClick={handleOverlayClick}>
      <div className="comments-modal" onClick={stopPropagation}>
        <header className="comments-header">
          <h2 className="comments-title">Comments</h2>
          <button
            type="button"
            className="comments-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="comments-list">
          {comments.length === 0 && (
            <p className="comments-empty">No comments yet.</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-author">{comment.authorEmail}</div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}
        </div>

        <form className="comments-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="comments-input"
            placeholder={
              user ? "Add a comment..." : "Log in to add comments"
            }
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            disabled={!user}
          />
          <button
            type="submit"
            className="comments-submit"
            disabled={!user || !commentText.trim()}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentsModal;
