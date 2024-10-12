// src/context/DocumentContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, limit, startAfter } from 'firebase/firestore';
import { firestore } from '../firebase/config';

interface DocumentContextProps {
  documents: any[];
  loading: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  hasMore: boolean;
  currentPage: number;
}

// Create a context for documents
const DocumentContext = createContext<DocumentContextProps | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Function to fetch documents with pagination
  const fetchDocuments = async (pageSize: number = 10, startingDoc: any = null) => {
    setLoading(true);
    const q = startingDoc
      ? query(collection(firestore, 'documents'), startAfter(startingDoc), limit(pageSize))
      : query(collection(firestore, 'documents'), limit(pageSize));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(docs);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setLoading(false);
      setHasMore(snapshot.size === pageSize);
    });

    return () => unsubscribe();
  };

  // Function to navigate to the next page
  const goToNextPage = () => {
    if (hasMore && lastDoc) {
      setCurrentPage((prev) => prev + 1);
      fetchDocuments(10, lastDoc);
    }
  };

  // Function to navigate to the previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      fetchDocuments();
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        goToNextPage,
        goToPreviousPage,
        hasMore,
        currentPage,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
