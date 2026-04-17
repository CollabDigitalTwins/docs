---
title: useComment hooks
description: SWR-based hooks for fetching, creating, updating, and deleting comments.
category: hooks
status: draft
last_updated: 2025-01-13
---

# useComment hooks

These hooks manage comment data across the application, including fetching comments by various filters (building, author), and performing CRUD operations. Built on SWR with automatic cache invalidation on mutations.

## Hooks

| Hook | Description |
|------|-------------|
| `useComments` | Fetches all comments |
| `useComment` | Fetches a single comment by ID, with update and delete mutations |
| `useCommentsByBuilding` | Fetches comments associated with a specific building |
| `useCommentsByAuthor` | Fetches comments written by a specific author |
| `useCreateComment` | Creates a new comment |

---

## `useComments`

Fetches all comments from the API.

### Signature

```ts
function useComments(): UseCommentsReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `comments` | `Comment[]` | Array of comments, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { comments, isLoading } = useComments();

if (isLoading) return <Skeleton />;

return (
  <ul>
    {comments.map((c) => (
      <li key={c.id}>{c.content}</li>
    ))}
  </ul>
);
```

### Notes

Uses SWR key `["comments"]`. Automatically revalidated when comments are created, updated, or deleted via related mutation hooks.

---

## `useComment`

Fetches a single comment by ID. Also provides `updateComment` and `deleteComment` mutation functions.

### Signature

```ts
function useComment(id: number | null): UseCommentReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number \| null` | Yes | Comment ID to fetch. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `comment` | `Comment \| null` | The fetched comment, or null if not loaded |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |
| `updateComment` | `(arg: Partial<Comment>) => Promise<Comment>` | Mutation trigger to update the comment |
| `isMutating` | `boolean` | True while update mutation is in progress |
| `updateError` | `Error \| undefined` | Error from update mutation |
| `updatedData` | `Comment \| undefined` | Returned data from successful update |
| `deleteComment` | `() => Promise<Comment>` | Mutation trigger to delete the comment |
| `isDeleting` | `boolean` | True while delete mutation is in progress |
| `deleteError` | `Error \| undefined` | Error from delete mutation |

### Example

```tsx
const { comment, isLoading, updateComment, deleteComment } = useComment(commentId);

const handleUpdate = async () => {
  await updateComment({ content: "Updated content" });
};

const handleDelete = async () => {
  await deleteComment();
};
```

### Notes

On successful update or delete, the hook invalidates related caches: the single comment key, the all-comments list, and any building-specific or author-specific comment lists if applicable.

---

## `useCommentsByBuilding`

Fetches all comments associated with a specific building.

### Signature

```ts
function useCommentsByBuilding(buildingId: number | null): UseCommentsByBuildingReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `buildingId` | `number \| null` | Yes | Building ID to filter by. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `comments` | `Comment[]` | Comments for the building, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { comments, isLoading } = useCommentsByBuilding(building.id);
```

### Notes

Uses SWR key `["comments", "building", buildingId]`. Cache is invalidated when comments are created or modified with a matching `buildingId`.

---

## `useCommentsByAuthor`

Fetches all comments written by a specific author.

### Signature

```ts
function useCommentsByAuthor(authorId: number | null): UseCommentsByAuthorReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `authorId` | `number \| null` | Yes | Author ID to filter by. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `comments` | `Comment[]` | Comments by the author, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { comments, isLoading } = useCommentsByAuthor(currentUser.id);
```

### Notes

Uses SWR key `["commentsByAuthor", authorId]`. Cache is invalidated when comments are created or modified with a matching `authorId`.

---

## `useCreateComment`

Creates a new comment.

### Signature

```ts
function useCreateComment(): UseCreateCommentReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `createComment` | `(arg: { commentData: Partial<Comment> }) => Promise<Comment>` | Mutation trigger to create a comment |
| `isMutating` | `boolean` | True while mutation is in progress |
| `createError` | `Error \| undefined` | Error from create mutation |
| `createdData` | `Comment \| undefined` | Returned data from successful creation |

### Example

```tsx
const { createComment, isMutating } = useCreateComment();

const handleSubmit = async (content: string) => {
  await createComment({
    commentData: { content, buildingId: 123, authorId: currentUser.id },
  });
};
```

### Notes

On success, invalidates the all-comments list and any building-specific or author-specific lists based on the created comment's `buildingId` and `authorId`.

---

## Related

- [Data model: Comment](/docs/data-model/comment)
- [Hooks: useBuilding](/docs/hooks/buildings)
