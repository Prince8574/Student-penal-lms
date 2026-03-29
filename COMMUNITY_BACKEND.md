# Community Backend — Complete Reference

## Status: ✅ Fully Implemented

All models, controllers, routes, and server registration are in place.
Frontend is wired to the real API with optimistic UI fallback.

---

## Architecture

```
MongoDB (learnverse)
  ├── posts       ← Post model
  └── messages    ← Message model (conversations)

Express API (port 5001)
  ├── /api/posts/*     ← postController.js
  └── /api/messages/*  ← messageController.js
```

---

## Models

### Post (`models/Post.js`)

| Field | Type | Notes |
|-------|------|-------|
| `author` | ObjectId → User | required |
| `content` | String | max 5000 chars |
| `image` | String | base64 or URL |
| `tag` | Enum | Question / Resource / Study Group / Achievement / Feedback / Discussion |
| `likes` | [ObjectId] | array of user IDs |
| `reactions` | Map(String→Number) | emoji → count |
| `bookmarks` | [ObjectId] | array of user IDs |
| `comments` | [CommentSchema] | embedded |
| `comments.replies` | [ReplySchema] | nested in comment |

### Message (`models/Message.js`)

| Field | Type | Notes |
|-------|------|-------|
| `participants` | [ObjectId] | exactly 2 users |
| `messages` | [MessageItem] | embedded array |
| `messages.sender` | ObjectId | who sent it |
| `messages.text` | String | max 3000 chars |
| `messages.readBy` | [ObjectId] | read receipts |
| `lastMessage` | String | preview text |
| `lastAt` | Date | for sorting |

---

## API Endpoints

### Posts — `/api/posts`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/posts` | Get all posts (paginated) |
| GET | `/api/posts?tag=Question` | Filter by tag |
| GET | `/api/posts?page=2&limit=10` | Pagination |
| POST | `/api/posts` | Create a post |
| POST | `/api/posts/:id/like` | Toggle like |
| POST | `/api/posts/:id/react` | Add emoji reaction |
| POST | `/api/posts/:id/bookmark` | Toggle bookmark |
| POST | `/api/posts/:id/comments` | Add comment |
| POST | `/api/posts/:id/comments/:cid/like` | Like a comment |
| POST | `/api/posts/:id/comments/:cid/replies` | Reply to comment |

**Create Post body:**
```json
{ "content": "...", "tag": "Question", "image": "base64..." }
```

**React body:**
```json
{ "emoji": "❤️" }
```

### Messages — `/api/messages`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/messages` | Get all conversations |
| GET | `/api/messages/:userId` | Get/create conversation + mark read |
| POST | `/api/messages/:userId` | Send a message |
| GET | `/api/messages/users/search?q=name` | Search users |

**Send Message body:**
```json
{ "text": "Hello!" }
```

---

## Frontend Integration (`Community.js`)

```js
const API = 'http://localhost:5001/api';
function authHeaders() {
  return { Authorization: 'Bearer ' + localStorage.getItem('token') };
}
```

### Feed Tab
- On tab open → `GET /api/posts` (with tag filter)
- Like → `POST /api/posts/:id/like`
- React → `POST /api/posts/:id/react`
- Bookmark → `POST /api/posts/:id/bookmark`
- Comment → `POST /api/posts/:id/comments`
- Reply → `POST /api/posts/:id/comments/:cid/replies`
- Comment like → `POST /api/posts/:id/comments/:cid/like`
- New post → `POST /api/posts` (optimistic UI)

### Messages Tab
- On mount → `GET /api/messages` (load inbox)
- Select conversation → `GET /api/messages/:userId` (load messages + mark read)
- Send → `POST /api/messages/:userId` (optimistic UI)

### Error Handling
All API calls have `.catch()` with optimistic local state fallback — UI stays responsive even if backend is down.

---

## Checklist

- [x] Post model with comments + replies + reactions
- [x] Message model with read receipts
- [x] Post controller — all CRUD + like/react/bookmark/comment/reply
- [x] Message controller — conversations + send + search users
- [x] Routes registered in server.js
- [x] Auth middleware (`protect`) on all routes
- [x] Frontend wired to API with optimistic fallback
- [x] CORS configured for localhost:3001

---

## To Test

```bash
# Start backend
cd student-panel/src/backend
npm run dev

# Test health
curl http://localhost:5001/api/health

# Get posts (need token)
curl -H "Authorization: Bearer <token>" http://localhost:5001/api/posts

# Get conversations
curl -H "Authorization: Bearer <token>" http://localhost:5001/api/messages
```
