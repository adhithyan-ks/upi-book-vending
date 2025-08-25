<script>
    import { goto } from '$app/navigation';
    // Svelte 5 runes for reactive state
    let count = $state(1);
    let isShaking = $state(false);
    let isPopping = $state(false);

    const price = 55; // Price per item
    // Define the minimum and maximum values for the counter
    // These can be adjusted as needed
    const minValue = 1;
    const maxValue = 5;
    let totalPrice = $derived(count * price);
    // A helper function to trigger animations by quickly toggling state
    function triggerAnimation(animationStateSetter) {
        animationStateSetter.value = true;
        setTimeout(() => {
            animationStateSetter.value = false;
        }, 300); // Must match the animation duration in CSS
    }

    function increment() {
        if (count < maxValue) {
            count++;
            triggerAnimation({ set value(v) { isPopping = v; } });
        } else {
            triggerAnimation({ set value(v) { isShaking = v; } });
        }
    }

    function decrement() {
        if (count > minValue) {
            count--;
            triggerAnimation({ set value(v) { isPopping = v; } });
        } else {
            triggerAnimation({ set value(v) { isShaking = v; } });
        }
    }
</script>

<div class="product-card">
    <h2>Select Quantity</h2>
    
    <div class="counter-container" class:shake-animation={isShaking}>
        <button class="counter-btn" onclick={decrement}>-</button>
        
        <span class="counter-value" class:pop-animation={isPopping}>
            {count}
        </span>
        
        <button class="counter-btn" onclick={increment}>+</button>
    </div>
    
    <button class="buy-btn" onclick={() => goto(`/payment?amount=${totalPrice}`)}>Buy Now For {totalPrice} &#8377; </button>
</div>

<style>
    /* General Styling */
    :global(body) {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #f0f4f8;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Main Container */
    .product-card {
        background-color: #ffffff;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        padding: 40px;
        text-align: center;
        width: 320px;
        overflow: hidden;
    }

    h2 {
        margin-top: 0;
        color: #333;
        font-size: 24px;
    }

    /* Counter Styling */
    .counter-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 30px 0;
    }
    
    .counter-btn {
        background-color: #e3eaf1;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 28px;
        font-weight: bold;
        color: #555;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .counter-btn:hover {
        background-color: #d1d9e6;
    }

    .counter-btn:active {
        transform: scale(0.9);
    }

    .counter-value {
        font-size: 48px;
        font-weight: bold;
        color: #007bff;
        margin: 0 30px;
        width: 60px; /* Fixed width to prevent layout shifts */
        display: inline-block; /* Needed for transform to work properly */
    }

    /* Buy Button Styling */
    .buy-btn {
        background: linear-gradient(45deg, #007bff, #0056b3);
        border: none;
        border-radius: 12px;
        color: white;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        transition: transform 0.2s, box-shadow 0.3s;
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
    }

    .buy-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 123, 255, 0.5);
    }
    
    .buy-btn:active {
        transform: translateY(0);
    }

    /* Animations */
    @keyframes pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }

    .pop-animation {
        animation: pop 0.3s ease-out;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .shake-animation {
        animation: shake 0.3s linear;
    }
</style>