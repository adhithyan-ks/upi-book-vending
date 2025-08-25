<div class="payment-status success">
  <h1>Payment Successful!</h1>
  <p>Your transaction has been completed successfully.</p>
  <a href="/">Go to home page</a>
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

  .success h1 {
    color: #4CAF50;
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