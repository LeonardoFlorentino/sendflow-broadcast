import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuthContext } from "./useAuthContext";

export interface Connection {
  id: string;
  clientId: string;
  name?: string;
  status?: string;
  phone?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  [key: string]: unknown;
}

interface UseConnectionsResult {
  connections: Connection[];
  loading: boolean;
  error: string;
  createConnection: (name: string) => Promise<void>;
  updateConnection: (connectionId: string, name: string) => Promise<void>;
  deleteConnection: (
    connection: Pick<Connection, "id" | "clientId">,
  ) => Promise<void>;
}

interface ConnectionsSnapshotState {
  connections: Connection[];
  error: string;
  resolvedUserId: string | null;
}

function mapConnection(doc: DocumentData & { id?: string }): Connection {
  return {
    id: doc.id ?? "",
    clientId: String(doc.clientId ?? ""),
    name: typeof doc.name === "string" ? doc.name : undefined,
    status: typeof doc.status === "string" ? doc.status : undefined,
    phone: typeof doc.phone === "string" ? doc.phone : undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    ...doc,
  };
}

export function useConnections(): UseConnectionsResult {
  const { userId } = useAuthContext();
  const [snapshotState, setSnapshotState] = useState<ConnectionsSnapshotState>({
    connections: [],
    error: "",
    resolvedUserId: null,
  });

  useEffect(() => {
    if (!userId) {
      return;
    }

    const connectionsQuery = query(
      collection(db, "connections"),
      where("clientId", "==", userId),
    );

    const unsubscribe = onSnapshot(
      connectionsQuery,
      (snapshot) => {
        const nextConnections = snapshot.docs.map((doc) =>
          mapConnection({
            id: doc.id,
            ...doc.data(),
          }),
        );

        setSnapshotState({
          connections: nextConnections,
          error: "",
          resolvedUserId: userId,
        });
      },
      (snapshotError) => {
        console.error("Connections snapshot error:", snapshotError);
        setSnapshotState({
          connections: [],
          error: "Não foi possível carregar as conexões em tempo real",
          resolvedUserId: userId,
        });
      },
    );

    return unsubscribe;
  }, [userId]);

  const loading = Boolean(userId) && snapshotState.resolvedUserId !== userId;
  const connections =
    snapshotState.resolvedUserId === userId ? snapshotState.connections : [];
  const error = !userId
    ? "Usuário não autenticado"
    : snapshotState.resolvedUserId === userId
      ? snapshotState.error
      : "";

  async function createConnection(name: string): Promise<void> {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    await addDoc(collection(db, "connections"), {
      name: name.trim(),
      clientId: userId,
    });
  }

  async function updateConnection(
    connectionId: string,
    name: string,
  ): Promise<void> {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    await updateDoc(doc(db, "connections", connectionId), {
      name: name.trim(),
      clientId: userId,
    });
  }

  async function deleteConnection(
    connection: Pick<Connection, "id" | "clientId">,
  ): Promise<void> {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    if (connection.clientId !== userId) {
      throw new Error("Você não pode excluir uma conexão de outro cliente");
    }

    await deleteDoc(doc(db, "connections", connection.id));
  }

  return {
    connections,
    loading,
    error,
    createConnection,
    updateConnection,
    deleteConnection,
  };
}
