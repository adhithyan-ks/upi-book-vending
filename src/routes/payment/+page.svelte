
<script>
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';

  const amount = writable(0);
  const paymentStatus = writable('');

  // Read amount from query parameter on component load
  $:{ /* Svelte 5 reactive statement */
    const urlAmount = $page.url.searchParams.get('amount');
    if (urlAmount) {
      amount.set(parseFloat(urlAmount));
    }
  }

  function simulatePayment() {
    const isSuccess = Math.random() > 0.5; // 50% chance of success

    if (isSuccess) {
      paymentStatus.set('success');
      goto('/payment/success');
    } else {
      paymentStatus.set('failure');
      goto('/payment/failure');
    }
  }
</script>

<div class="payment-container">
  <h1>Simulate Payment for {$amount} &#8377;</h1>
  <button on:click={simulatePayment}>Pay Now</button>

  {#if $paymentStatus}
    <p>Payment Status: {$paymentStatus}</p>
  {/if}
</div>

<style>
  .payment-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    font-family: Arial, sans-serif;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type="number"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
    font-size: 16px;
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #45a049;
  }

  p {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
  }
</style>
