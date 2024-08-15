import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";

interface DocumentData{
    [key: string]: any
}

export const useFetchDocuments = <T extends DocumentData>(docCollection: string, search: string | null = null, uid:string | null = null) => {
  const [documents, setDocuments] = useState<T[] | null> (null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);

  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (cancelled) {
        return;
      }

      setLoading(true);

      const collectionRef = await collection(db, docCollection);

      try {
        let q;

        if (search) {
          q = await query(
            collectionRef,
            where("tagsArray", "array-contains", search),
            orderBy("createdAt", "desc")
          );
        } else if (uid) {
          q = await query(
            collectionRef,
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
          );
        } else {
          q = await query(collectionRef, orderBy("createdAt", "desc"));
        }

        await onSnapshot(q, (querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as T),
            }))
          );
        });
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      }

      setLoading(false);
    }

    loadData();
  }, [docCollection, search, uid, cancelled]);

  console.log(documents);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { documents, loading, error };
};