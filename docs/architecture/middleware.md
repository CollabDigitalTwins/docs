---
sidebar_position: 8
---

# Middleware

CDT uses the term "middleware" to describe the layer between UI components and application state — specifically the combination of React Context, reducers, and action creators that ensure components remain purely presentational.

> This is distinct from Next.js route middleware (`middleware.ts`). CDT does not currently use a Next.js middleware file.

## Principle

UI components should not contain business logic. They:

- Render based on state they receive from context
- Dispatch named actions when the user interacts
- Never compute the next state themselves

The middleware layer (context + reducer) handles all state transitions.

## Uniform Data Flow

```
User interaction
      ↓
  dispatch(action)
      ↓
    Reducer
      ↓
  New state
      ↓
  Context update
      ↓
  Component re-renders
```

State flows in one direction. Components never mutate state directly — they describe *what happened* and the reducer decides *what changes*.

## Anatomy of a Middleware Slice

Every domain in `src/core/store/` follows the same structure.

### State

```ts
export type AuthState = {
  isAuthenticated: boolean
  username: string | null
  email: string | null
}
```

### Action payload map

```ts
export type AuthPayload = {
  LOGIN:  { account: any; profile: any }
  LOGOUT: { account: any; profile: any }
}
```

### Reducer

```ts
export const AuthReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, ...action.payload }
    case 'LOGOUT':
      return { ...state, account: {}, profile: {} }
    default:
      return state
  }
}
```

### Context and provider

```tsx
export const AuthContext = createContext<{
  state: InitialStateType
  dispatch: Dispatch<AuthActions>
}>({ state: initialState, dispatch: () => null })

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Using Middleware in a Component

Import the context, destructure `state` and `dispatch`, and call `dispatch` on interaction. The component does not know how the state changes — only that an action occurred.

```tsx
import { MapStyleContext } from '@/core/store/Map/context'

export default function MapStyleMenu() {
  const { state, dispatch } = useContext(MapStyleContext)

  return (
    <div onClick={() => dispatch({ type: 'UPDATE_MAP_STYLE', payload: { name: 'streets' } })}>
      {state.map.mapStyle}
    </div>
  )
}
```

## Adding a New Slice

1. Create `src/core/store/<Domain>/reducer.ts` — define state type, action payload map, and reducer.
2. Create `src/core/store/<Domain>/context.tsx` — define the context and provider.
3. Register the provider in `CombineProviders.tsx`.
4. Export from `src/core/store/index.ts`.

## Related

- [State Management](./state-management.md) — full provider list, CombineProviders, and key files
- [Authorization](../authorization/authorization_roles_permissions.md) — how CASL integrates with the Permissions provider
