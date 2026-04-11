<div align="center">

<img src="images/logo.png" alt="UPI Book Vending Machine Logo" width="150">

# UPI Book Vending Machine

*An automated book vending system powered by UPI payments, cloud storage, and IoT robotic arm integration — built with SvelteKit and modern web technologies.*

[![Svelte](https://img.shields.io/badge/Svelte_5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![MQTT](https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white)](https://www.hivemq.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## 📋 About the Project

**UPI Book Vending Machine** is a full-stack web application that orchestrates the entire lifecycle of an automated book vending system — from browsing and selecting books, to processing secure UPI payments via Razorpay, to triggering an IoT robotic arm that physically dispenses the purchased books.

> **Project Context**
> This project integrates **web development**, **payment processing**, **cloud databases**, and **IoT communication** into a single cohesive platform, demonstrating a real-world end-to-end automation pipeline.

### ✨ Key Features

- **📦 Book Selection** — Intuitive counter interface to select quantity (1–5 books)
- **💳 UPI Payments** — Secure payment processing via Razorpay payment gateway
- **🗄️ Order Management** — Automatic order persistence to Supabase (PostgreSQL)
- **🤖 IoT Integration** — Sends MQTT signals to a robotic arm via HiveMQ for automated book dispensing
- **📊 Order Dashboard** — Filterable order history with revenue stats, item counts, and status tracking
- **✅ Payment Verification** — Server-side signature validation using Razorpay's cryptographic verification
- **📱 Responsive Design** — Mobile-first, glassmorphic UI built with modern CSS

---

## 🏗️ Architecture

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Browser   │──────▶│  SvelteKit   │──────▶│   Razorpay   │
│  (Client)   │◀──────│   Server     │◀──────│   Gateway    │
└─────────────┘       └──────┬───────┘       └──────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────▼─────┐   ┌──────▼──────┐
              │  Supabase  │   │   HiveMQ    │
              │ (Database) │   │   (MQTT)    │
              └────────────┘   └──────┬──────┘
                                      │
                               ┌──────▼──────┐
                               │ Robotic Arm  │
                               │    (IoT)     │
                               └──────────────┘
```

### Flow

1. **User** selects book quantity and clicks "Pay Securely"
2. **SvelteKit server** creates a Razorpay order and stores it in Supabase with status `created`
3. **Razorpay Checkout** opens for the user to complete payment (UPI / Card / Wallet)
4. On payment success, the **client** sends payment details to the `/api/verify-payment` endpoint
5. **Server** validates the payment signature cryptographically
6. Order status is updated to `paid` in **Supabase**
7. An **MQTT message** is published to HiveMQ (`orders/blink` topic) with the book count
8. The **robotic arm** (external IoT device) receives the signal and dispenses the books

---

## 🛠️ Tech Stack

| Layer           | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| **Framework**   | [SvelteKit](https://svelte.dev/) (Svelte 5)                      |
| **Build Tool**  | [Vite](https://vite.dev/) 7                                      |
| **Payments**    | [Razorpay](https://razorpay.com/) (Server SDK + Checkout.js)     |
| **Database**    | [Supabase](https://supabase.com/) (PostgreSQL)                   |
| **IoT / MQTT**  | [HiveMQ](https://www.hivemq.com/) via [mqtt.js](https://github.com/mqttjs/MQTT.js) |
| **Styling**     | Vanilla CSS with glassmorphism, animations, and Inter font        |
| **Deployment**  | Vercel-ready (`@sveltejs/adapter-auto`)                           |

---

## 📁 Project Structure

```
upi-book-vending/
├── src/
│   ├── routes/
│   │   ├── +page.svelte              # Home – book selector & payment UI
│   │   ├── +page.server.js           # Order creation & recent orders loader
│   │   ├── +layout.svelte            # Root layout
│   │   ├── api/
│   │   │   └── verify-payment/
│   │   │       └── +server.js        # Payment signature verification + MQTT trigger
│   │   ├── orders/
│   │   │   ├── +page.svelte          # Order dashboard with filters & stats
│   │   │   └── +page.server.js       # Fetches all orders from Supabase
│   │   └── payment-success/
│   │       └── +page.svelte          # Payment success confirmation page
│   └── lib/
│       ├── supabaseClient.js          # Public Supabase client (anon key)
│       ├── server/
│       │   ├── razorpay.js            # Razorpay server instance
│       │   ├── database.js            # Supabase CRUD operations (admin)
│       │   ├── mqtt.js                # MQTT client & publish function
│       │   └── supabaseAdminClient.js # Supabase admin client (service key)
│       ├── components/
│       │   └── NewCounter.svelte      # Counter component
│       └── assets/
│           └── favicon.svg            # App favicon
├── static/
│   └── robots.txt
├── package.json
├── svelte.config.js
├── vite.config.js
└── eslint.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- A [Razorpay](https://razorpay.com/) account (test or live keys)
- A [Supabase](https://supabase.com/) project with an `orders` table
- A [HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/) instance (or any MQTT broker)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/upi-book-vending.git
cd upi-book-vending
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# ── Razorpay ──────────────────────────────
PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ── Supabase ──────────────────────────────
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key

# ── MQTT (HiveMQ) ────────────────────────
MQTT_URL=mqtts://your-broker.hivemq.cloud:8883
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password
```

### 4. Set up the Supabase database

Create an `orders` table in your Supabase project with the following schema:

```sql
CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id    TEXT UNIQUE NOT NULL,
  amount      INTEGER NOT NULL,
  currency    TEXT DEFAULT 'INR',
  receipt     TEXT,
  status      TEXT DEFAULT 'created',
  payment_id  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏭 Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

> **Note:** For deployment, you may need to install a [SvelteKit adapter](https://svelte.dev/docs/kit/adapters) matching your target platform (Vercel, Netlify, Node, etc.).

---

## 🤖 IoT — Robotic Arm Integration

After a successful payment, the server publishes an MQTT message to the `orders/blink` topic on HiveMQ:

| Detail          | Value                                              |
| --------------- | -------------------------------------------------- |
| **Broker**      | HiveMQ Cloud (TLS on port 8883)                   |
| **Topic**       | `orders/blink`                                     |
| **Payload**     | Book count as a string (e.g., `"3"`)               |
| **Triggered**   | After payment verification succeeds                |

The robotic arm (separate hardware project) subscribes to this topic and dispenses the corresponding number of books.

> The IoT robotic arm firmware / code is **not** included in this repository.

---

## 📄 API Reference

### `POST /api/verify-payment`

Verifies a Razorpay payment signature, updates the order in Supabase, and triggers the MQTT signal.

**Request Body:**

```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxx",
  "razorpay_signature": "xxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response:**

```json
{ "status": "ok" }
```

---

## 🧾 Pages

| Route               | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `/`                  | Home — select quantity, pay, and view recent orders    |
| `/orders`            | Order dashboard — full history with filters and stats  |
| `/payment-success`   | Payment confirmation page                             |

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).