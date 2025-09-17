# UPI Book Vending Machine

This is a web application that simulates a book vending machine using UPI payments. It's built with SvelteKit and uses Razorpay for handling payments.

## Features

*   Enter an amount to pay.
*   Generates a Razorpay order.
*   Redirects to a payment success page.
*   Verifies the payment status.

## Tech Stack

*   **Framework:** SvelteKit
*   **Payment Gateway:** Razorpay
*   **Database (for orders):** Supabase

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd upi-book-vending
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project:
    ```bash
    touch .env
    ```
    And add your Razorpay & Supabase API keys:

    ```
    RAZORPAY_KEY_ID=<your_razorpay_key_id>
    RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>

    PUBLIC_SUPABASE_URL=<your_supabase_url>
    PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
    SUPABASE_SECRET_KEY=<your_supabase_secret_key>
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## Building for Production

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> **Note:** To deploy your app, you may need to install a SvelteKit adapter for your target environment.