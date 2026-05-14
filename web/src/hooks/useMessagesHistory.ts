import { useEffect, useState } from "react";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuthContext } from "./useAuthContext";

export type MessageHistoryStatus = "scheduled" | "sent";

export interface MessageHistoryItem {
  id: string;
  clientId: string;
  contactIds: string[];
  content: string;
  scheduledAt: Timestamp | null;
  status: MessageHistoryStatus;
}

interface MessagesHistorySnapshotState {
  messages: MessageHistoryItem[];
  error: string;
  resolvedKey: string | null;
}

interface UseMessagesHistoryResult {
  messages: MessageHistoryItem[];
  loading: boolean;
  error: string;
}

function mapMessage(doc: DocumentData & { id?: string }): MessageHistoryItem {
  return {
    id: doc.id ?? "",
    clientId: String(doc.clientId ?? ""),
    contactIds: Array.isArray(doc.contactIds)
      ? doc.contactIds.filter((value): value is string => typeof value === "string")
      : [],
    content: typeof doc.content === "string" ? doc.content : "",
    scheduledAt: doc.scheduledAt instanceof Timestamp ? doc.scheduledAt : null,
    status: doc.status === "sent" ? "sent" : "scheduled",
  };
}

export function useMessagesHistory(
  status: MessageHistoryStatus,
): UseMessagesHistoryResult {
  const { userId } = useAuthContext();
  const [snapshotState, setSnapshotState] = useState<MessagesHistorySnapshotState>(
    {
      messages: [],
      error: "",
      resolvedKey: null,
    },
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    const resolvedKey = `${userId}:${status}`;
    const messagesQuery = query(
      collection(db, "messages"),
      where("clientId", "==", userId),
      where("status", "==", status),
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const nextMessages = snapshot.docs
          .map((doc) =>
            mapMessage({
              id: doc.id,
              ...doc.data(),
            }),
          )
          .sort((a, b) => {
            const aTime = a.scheduledAt?.toMillis() ?? 0;
            const bTime = b.scheduledAt?.toMillis() ?? 0;
            return bTime - aTime;
          });

        setSnapshotState({
          messages: nextMessages,
          error: "",
          resolvedKey,
        });
      },
      (snapshotError) => {
        console.error("Messages history snapshot error:", snapshotError);
        setSnapshotState({
          messages: [],
          error: "Não foi possível carregar o histórico de mensagens",
          resolvedKey,
        });
      },
    );

    return unsubscribe;
  }, [status, userId]);

  const resolvedKey = userId ? `${userId}:${status}` : null;
  const loading = Boolean(userId) && snapshotState.resolvedKey !== resolvedKey;
  const messages =
    snapshotState.resolvedKey === resolvedKey ? snapshotState.messages : [];
  const error = !userId
    ? "Usuário não autenticado"
    : snapshotState.resolvedKey === resolvedKey
      ? snapshotState.error
      : "";

  return {
    messages,
    loading,
    error,
  };
}
