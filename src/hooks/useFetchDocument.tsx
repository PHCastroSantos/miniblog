import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface DocumentData{
    [key: string]: any
}

export const useFetchDocument = <T extends DocumentData>(docCollection: string, id: string) => {
  const [document, setDocument] = useState<T | null> (null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);

  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      if (cancelled) {
        return;
      }

      setLoading(true)

      try {

        const docRef = await doc(db, docCollection, id)
        const docSnap = await getDoc(docRef)

        setDocument(docSnap.data() as T)

        setLoading(false)

      } catch(error: any) {
        setError(error.message)
        setLoading(false)
      }

    }

    loadDocument();
  }, [docCollection, id, cancelled]);

  console.log(document);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { document, loading, error };
};