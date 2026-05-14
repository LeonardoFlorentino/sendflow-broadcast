import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuthContext } from "./useAuthContext";

export interface MessageInput {
  contactIds: string[];
  content: string;
  scheduledAt: Date;
}

interface UseMessagesResult {
  createMessage: (input: MessageInput) => Promise<void>;
  updateMessage: (messageId: string, input: MessageInput) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

export function useMessages(): UseMessagesResult {
  const { userId } = useAuthContext();

  async function createMessage(input: MessageInput): Promise<void> {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    await addDoc(collection(db, "messages"), {
      clientId: userId,
      contactIds: input.contactIds,
      content: input.content.trim(),
      scheduledAt: Timestamp.fromDate(input.scheduledAt),
      status: "scheduled",
    });
  }

  async function updateMessage(
    messageId: string,
    input: MessageInput,
  ): Promise<void> {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    await updateDoc(doc(db, "messages", messageId), {
      clientId: userId,
      contactIds: input.contactIds,
      content: input.content.trim(),
      scheduledAt: Timestamp.fromDate(input.scheduledAt),
    });
  }

  async function deleteMessage(messageId: string): Promise<void> {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    await deleteDoc(doc(db, "messages", messageId));
  }

  return {
    createMessage,
    updateMessage,
    deleteMessage,
  };
}
