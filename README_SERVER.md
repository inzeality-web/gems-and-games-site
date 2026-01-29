# Local server for Gems & Games

This project includes a minimal Node.js server that serves the static site and provides a Socket.IO endpoint plus a small API to update `data/products.json`.

Quick start (requires Node 18+):

```bash
# install
npm install

# run
npm start
```

- The server serves files from the project root (so open http://localhost:3000/admin.html).
- Socket.IO will be available at the same origin; clients use `io()`.
- API endpoints:
  - `GET /api/products` — returns current products array
  - `POST /api/product` — accepts a single product object and appends it (front of list)
  - `POST /api/products` — replace whole array (send JSON array)

Deploy notes:
- You can deploy this Node app to Render by pointing a Render web service to this repository and using `npm start` as the start command.
- Ensure the process has write access to the `data/` directory so `products.json` can be updated.
