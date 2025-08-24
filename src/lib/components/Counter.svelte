<script>
    let count = $state(1);
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
    <button onclick={decrement}>-</button>
    <span>{count}</span>
    <button onclick={increment}>+</button>
</div>

<style>
    button {
      --😀: #644dff;
      --😀😀: #4836bb;
      --😀😀😀: #654dff63;
      cursor: pointer;
      width: 170px;
      height: 48px;
      /* display: flex; */
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 1.125em;
      font-weight: 800;
      letter-spacing: 2px;
      color: #fff;
      background: var(--😀);
      border: 2px solid var(--😀😀);
      border-radius: .75rem;
      box-shadow: 0 8px 0 var(--😀😀);
      transform: skew(-10deg);
      transition: all .1s ease;
      filter: drop-shadow(0 15px 20px var(--😀😀😀));
    }
    button:active {
      letter-spacing: 0px;
      transform: skew(-10deg) translateY(8px);
      box-shadow: 0 0 0 var(--😀😀😀);
    }
    span {
      font-size: 2em;
      font-weight: 800;
      color: var(--😀);
      text-shadow: 0 0 10px var(--😀😀😀);
      max-width: 20px;
      text-align: center;
    }
</style>