
  # Resort Admin Dashboard

  This is a code bundle for Resort Admin Dashboard. The original project is available at https://www.figma.com/design/T5TvGiql8E5J0KF7S0nn7D/Resort-Admin-Dashboard.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Environment

  Create a `.env` file and set:

  ```
  VITE_API_URL=http://127.0.0.1:8000
  ```

  The admin uses Bearer tokens stored under the `token` key in localStorage and calls backend endpoints under `/api/*` (e.g., `/api/login`, `/api/user`, `/api/villas`, `/api/bookings`).
  