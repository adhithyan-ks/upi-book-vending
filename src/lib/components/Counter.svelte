<script>
    import Button from "./Button.svelte";
    let count = $state(1)
    const increment = () => {
        if (count < 5) 
            count += 1;
    };
    const decrement = () => {
        if (count > 1) 
            count -= 1;
    };
</script>
<div class="counter">
    <h1>Choose number of books to buy</h1>
    <Button onclick={decrement}>-</Button>
    <span>{count}</span>
    <Button onclick={increment}>+</Button>
</div>

<style>
    span {
      font-size: 2em;
      font-weight: 800;
      color: var(--😀);
      text-shadow: 0 0 10px var(--😀😀😀);
      max-width: 20px;
      text-align: center;
      margin: 0 50px;
    }
    .counter {
        margin-top: 50px;
    }
</style>