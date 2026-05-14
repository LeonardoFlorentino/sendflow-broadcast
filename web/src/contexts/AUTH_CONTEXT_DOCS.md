# Auth Context — Documentação

## Estrutura

### Context

- **[contexts/authContext.ts](../src/contexts/authContext.ts)** — Define o `AuthContext` (criação do context)
- **[contexts/AuthContext.tsx](../src/contexts/AuthContext.tsx)** — Componente `AuthProvider` (provider do context)

### Hook

- **[hooks/useAuthContext.ts](../src/hooks/useAuthContext.ts)** — Hook `useAuthContext()` para acessar o contexto

## Como Usar

### 1. Na Raiz da Aplicação

O `AuthProvider` já está configurado em [main.tsx](../src/main.tsx):

```tsx
<ThemeProvider theme={theme}>
  <CssBaseline />
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
</ThemeProvider>
```

### 2. Acessar dados de autenticação em qualquer componente

```tsx
import { useAuthContext } from "../hooks/useAuthContext";

function MyComponent() {
  const { user, userId, loading, signOut } = useAuthContext();

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <p>Usuário: {user?.email}</p>
      <p>UID (userId): {userId}</p>
      <button onClick={signOut}>Sair</button>
    </div>
  );
}
```

## Interface `AuthContextType`

```typescript
interface AuthContextType {
  user: User | null; // Objeto do usuário do Firebase (email, displayName, photoURL, uid, etc.)
  userId: string | null; // UID do usuário (equivalente a user?.uid)
  loading: boolean; // Está verificando autenticação
  signIn: (email, password) => Promise<void>;
  signUp: (email, password) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}
```

## Proteção de Rotas

### PrivateRoute

Protege rotas que requerem autenticação:

```tsx
<PrivateRoute>
  <MainLayout />
</PrivateRoute>
```

- Se não autenticado → redireciona para `/login`
- Mostra `<CircularProgress />` enquanto verifica autenticação

### PublicRoute

Redireciona usuários autenticados:

```tsx
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

- Se autenticado → redireciona para `/`

## Exemplo de Uso com userId

```tsx
import { useAuthContext } from "../hooks/useAuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

function UserBroadcasts() {
  const { userId } = useAuthContext();

  // userId já está disponível globalmente
  const fetchBroadcasts = async () => {
    if (!userId) return;

    const q = query(
      collection(db, "broadcasts"),
      where("userId", "==", userId),
    );
    const docs = await getDocs(q);
    return docs.docs.map((doc) => doc.data());
  };

  return <div>...</div>;
}
```

## Fluxo de Autenticação

1. **MainLayout** usa `useAuthContext()` para exibir avatar do usuário
2. **DashboardPage** acessa `userId` e `user` para exibir dados personalizados
3. **Qualquer componente** pode chamar `useAuthContext()` para acessar autenticação globalmente
4. **PrivateRoute** garante que apenas usuários autenticados acessem a dashboard
5. **PublicRoute** garante que usuários autenticados são redirecionados para a dashboard

---

✅ **Status:** Autenticação centralizada, userId disponível globalmente, rotas protegidas.
