import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/init.js";
import { useAuth } from "../context/AuthContext.jsx";
import ThreadForm from "../components/ThreadForm.jsx";
import ThreadCard from "../components/ThreadCard.jsx";
import SkeletonThreadCard from "../components/SkeletonThreadCard.jsx";

function Home() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [posting, setPosting] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);

  useEffect(() => {
    const threadsQuery = query(
      collection(db, "threads"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(threadsQuery, (snapshot) => {
      const list = snapshot.docs.map((snapshotDoc) => ({
        id: snapshotDoc.id,
        ...snapshotDoc.data(),
      }));
      setThreads(list);
      setLoadingThreads(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleCreateThread(text) {
    if (!user) {
      return;
    }

    try {
      setPosting(true);
      await addDoc(collection(db, "threads"), {
        text,
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: serverTimestamp(),
        likes: [],
      });
    } catch (error) {
      console.error("Error creating thread:", error);
    } finally {
      setPosting(false);
    }
  }

  async function handleDeleteThread(threadId) {
    if (!user) {
      return;
    }

    const thread = threads.find((item) => item.id === threadId);
    if (!thread) {
      return;
    }

    if (thread.authorId !== user.uid) {
      alert("You can only delete your own threads.");
      return;
    }

    const confirmDelete = window.confirm("Delete this thread?");
    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(doc(db, "threads", threadId));
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  }

  return (
    <main className="home">
      <h1 className="home__title">Threads Feed</h1>
      <ThreadForm onSubmit={handleCreateThread} loading={posting} />

      <section className="home__threads">
        {loadingThreads ? (
          <>
            <SkeletonThreadCard />
            <SkeletonThreadCard />
            <SkeletonThreadCard />
          </>
        ) : (
          threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              canDelete={user && thread.authorId === user.uid}
              onDelete={handleDeleteThread}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default Home;



