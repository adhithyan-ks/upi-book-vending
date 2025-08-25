<div class="payment-status failure">
  <h1>Payment Failed!</h1>
  <p>Unfortunately, your transaction could not be processed.</p>
  <a href="/payment">Try again</a>
</div>

<style>
  .payment-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    font-family: Arial, sans-serif;
    text-align: center;
  }

  .failure h1 {
    color: #f44336;
  }

  .payment-status p {
    margin-top: 10px;
    font-size: 18px;
  }

  .payment-status a {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }

  .payment-status a:hover {
    background-color: #0056b3;
  }
</style>