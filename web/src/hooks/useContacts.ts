import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuthContext } from "./useAuthContext";

export interface Contact {
  id: string;
  clientId: string;
  name: string;
  phone: string;
}

interface ContactsSnapshotState {
  contacts: Contact[];
  error: string;
  resolvedUserId: string | null;
}

interface UseContactsResult {
  contacts: Contact[];
  loading: boolean;
  error: string;
  createContact: (input: Pick<Contact, "name" | "phone">) => Promise<void>;
  updateContact: (
    contactId: string,
    input: Pick<Contact, "name" | "phone">,
  ) => Promise<void>;
}

function mapContact(doc: DocumentData & { id?: string }): Contact {
  return {
    id: doc.id ?? "",
    clientId: String(doc.clientId ?? ""),
    name: typeof doc.name === "string" ? doc.name : "",
    phone: typeof doc.phone === "string" ? doc.phone : "",
  };
}

export function useContacts(): UseContactsResult {
  const { userId } = useAuthContext();
  const [snapshotState, setSnapshotState] = useState<ContactsSnapshotState>({
    contacts: [],
    error: "",
    resolvedUserId: null,
  });

  useEffect(() => {
    if (!userId) {
      return;
    }

    const contactsQuery = query(
      collection(db, "contacts"),
      where("clientId", "==", userId),
    );

    const unsubscribe = onSnapshot(
      contactsQuery,
      (snapshot) => {
        const nextContacts = snapshot.docs.map((doc) =>
          mapContact({
            id: doc.id,
            ...doc.data(),
          }),
        );

        setSnapshotState({
          contacts: nextContacts,
          error: "",
          resolvedUserId: userId,
        });
      },
      (snapshotError) => {
        console.error("Contacts snapshot error:", snapshotError);
        setSnapshotState({
          contacts: [],
          error: "Nao foi possivel carregar os contatos em tempo real",
          resolvedUserId: userId,
        });
      },
    );

    return unsubscribe;
  }, [userId]);

  const loading = Boolean(userId) && snapshotState.resolvedUserId !== userId;
  const contacts =
    snapshotState.resolvedUserId === userId ? snapshotState.contacts : [];
  const error = !userId
    ? "Usuário não autenticado"
    : snapshotState.resolvedUserId === userId
      ? snapshotState.error
      : "";

  async function createContact(
    input: Pick<Contact, "name" | "phone">,
  ): Promise<void> {
    if (!userId) {
      throw new Error("Usuario nao autenticado");
    }

    await addDoc(collection(db, "contacts"), {
      name: input.name.trim(),
      phone: input.phone.trim(),
      clientId: userId,
    });
  }

  async function updateContact(
    contactId: string,
    input: Pick<Contact, "name" | "phone">,
  ): Promise<void> {
    if (!userId) {
      throw new Error("Usuario nao autenticado");
    }

    await updateDoc(doc(db, "contacts", contactId), {
      name: input.name.trim(),
      phone: input.phone.trim(),
      clientId: userId,
    });
  }

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
  };
}
