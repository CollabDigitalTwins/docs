---
title: useComment hooks
description: SWR-based hooks for fetching, creating, updating, and deleting comments.
---

# useComment hooks

Hooks for comment data, including filtering by building and by author.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useComments` | Fetches all comments |
| `useComment` | Fetches a single comment by ID, with update and delete mutations |
| `useCommentsByBuilding` | Fetches comments associated with a specific building |
| `useCommentsByAuthor` | Fetches comments written by a specific author |
| `useCreateComment` | Creates a new comment |

## `useComments()`

Fetches all comments as `comments: Comment[]`, on key `["comments"]`. Revalidated automatically whenever a comment is created, updated, or deleted.

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

## `useComment(id)`

Fetches a single comment by `id` (`number | null`), with update and delete mutations.

| Field | Type | Description |
|-------|------|-------------|
| `comment` | `Comment \| null` | The fetched comment, or null if not loaded |
| `updateComment` | `(arg: Partial<Comment>) => Promise<Comment>` | Update trigger |
| `deleteComment` | `() => Promise<Comment>` | Delete trigger |
| `isDeleting` | `boolean` | Whether a delete is in progress |
| `deleteError` | `Error \| undefined` | Error from the delete mutation |

```tsx
const { comment, isLoading, updateComment, deleteComment } = useComment(commentId);

const handleUpdate = async () => {
  await updateComment({ content: "Updated content" });
};

const handleDelete = async () => {
  await deleteComment();
};
```

A successful update or delete invalidates the single-comment key, the all-comments list, and any building- or author-specific lists that apply.

## `useCommentsByBuilding(buildingId)`

Fetches comments for a building (`number | null`) as `comments: Comment[]`, on key `["comments", "building", buildingId]`.

```tsx
const { comments, isLoading } = useCommentsByBuilding(building.id);
```

## `useCommentsByAuthor(authorId)`

Fetches comments by an author (`number | null`) as `comments: Comment[]`, on key `["commentsByAuthor", authorId]`.

```tsx
const { comments, isLoading } = useCommentsByAuthor(currentUser.id);
```

## `useCreateComment()`

Creates a comment. Returns `createComment: (arg: { commentData: Partial<Comment> }) => Promise<Comment>`.

```tsx
const { createComment, isMutating } = useCreateComment();

const handleSubmit = async (content: string) => {
  await createComment({
    commentData: { content, buildingId: 123, authorId: currentUser.id },
  });
};
```

A successful creation invalidates the all-comments list plus any building- and author-specific lists matching the new comment's `buildingId` and `authorId`.

## Related

- [Data model: Comment](/docs/architecture/data-model#comment)
- [Guides: Collaboration](/docs/guides/collaboration)
