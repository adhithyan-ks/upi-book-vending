<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_RAZORPAY_KEY_ID } from '$env/static/public';

	// The `form` prop contains the data returned from our form action. [cite: 188]
	let { form, data } = $props();

	// When the `form` prop updates with a successful order, open the checkout.
	$effect(() => {
		if (form?.success && form.order) {
			const order = form.order;

			const options = {
				key: PUBLIC_RAZORPAY_KEY_ID, // Your public key ID
				amount: order.amount,
				currency: order.currency,
				name: 'Record Book Store',
				description: 'Test Payment - Robotic Arm',
				order_id: order.id,
				// This handler function is called after payment
				handler: async (response) => {
					try {
						const res = await fetch('/api/verify-payment', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature
							})
						});

						const result = await res.json();
						if (result.status === 'ok') {
							window.location.href = '/payment-success'; // Redirect on success
						} else {
							alert('Payment verification failed. Please try again.');
						}
					} catch (err) {
						console.error('Verification request failed:', err);
						alert('An error occurred during payment verification.');
					}
				},
				prefill: {
					name: 'Svelte Developer',
					email: 'dev@svelte.dev',
					contact: '9999999999'
				},
				theme: {
					color: '#F37254'
				}
			};

			const rzp = new Razorpay(options);
			rzp.open();

			// Re-enable button once UI is open
			isInitializingPayment = false;
		} else if (form && !form.success) {
			isInitializingPayment = false;
			alert(form.message || 'An unknown error occurred.');
		}
	});

	//THIS IS HOME

	// COUNTER
	let count = $state(1);
	let isShaking = $state(false);
	let isPopping = $state(false);
	let isInitializingPayment = $state(false);

	let isRefreshingOrders = $state(false);

	async function handleRefreshOrders() {
		isRefreshingOrders = true;
		try {
			await invalidateAll();
		} finally {
			setTimeout(() => {
				isRefreshingOrders = false;
			}, 500);
		}
	}

	const price = 55; // Price per item
	// Define the minimum and maximum values for the counter
	// These can be adjusted as needed
	const minValue = 1;
	const maxValue = 5;
	let amount = $derived(count * price);
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
			triggerAnimation({
				set value(v) {
					isPopping = v;
				}
			});
		} else {
			triggerAnimation({
				set value(v) {
					isShaking = v;
				}
			});
		}
	}

	function decrement() {
		if (count > minValue) {
			count--;
			triggerAnimation({
				set value(v) {
					isPopping = v;
				}
			});
		} else {
			triggerAnimation({
				set value(v) {
					isShaking = v;
				}
			});
		}
	}
	// $inspect(amount);
</script>

<svelte:head>
	<title>Razorpay Payment</title>
	<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="wrapper">
	<div class="product-card">
		<div class="header-section">
			<h2>Record Book Store</h2>
			<p class="subtitle">Robotic Arm Test</p>
		</div>

		<div class="counter-section">
			<h3 class="input-label">Select Quantity</h3>
			<div class="counter-container" class:shake-animation={isShaking}>
				<button class="counter-btn" onclick={decrement} aria-label="Decrease quantity">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg
					>
				</button>

				<span class="counter-value" class:pop-animation={isPopping}>
					{count}
				</span>

				<button class="counter-btn" onclick={increment} aria-label="Increase quantity">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg
					>
				</button>
			</div>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				isInitializingPayment = true;
				return async ({ update }) => {
					await update();
				};
			}}
		>
			<input type="hidden" name="amount" bind:value={amount} />
			<button
				class="buy-btn"
				class:disabled={isInitializingPayment}
				disabled={isInitializingPayment}
			>
				{#if isInitializingPayment}
					<span style="display: flex; align-items: center; gap: 0.5rem;">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							style="animation: spin 1s linear infinite;"
							><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-1.36" /></svg
						>
						Processing...
					</span>
				{:else}
					<span>Pay Securely</span>
				{/if}
				<span class="price-badge">&#8377; {amount}</span>
			</button>
		</form>
	</div>

	<!-- Recent Orders Widget -->
	<div class="recent-orders-card">
		<div class="recent-header">
			<h3>Recent Orders</h3>
			<button
				class="refresh-btn-small"
				class:spinning={isRefreshingOrders}
				onclick={handleRefreshOrders}
				aria-label="Refresh recent orders"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-1.36" /></svg
				>
			</button>
		</div>

		{#if data?.recentOrders?.length > 0}
			<div class="recent-list">
				{#each data.recentOrders as order}
					<div class="recent-item">
						<div class="recent-info">
							<span class="recent-id font-mono text-sm"
								>{order.order_id || order.id || 'Unknown ID'}</span
							>
							<span class="recent-date"
								>{new Date(order.created_at).toLocaleDateString('en-IN', {
									month: 'short',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}</span
							>
						</div>
						<div class="recent-status-amount">
							<div style="display: flex; align-items: center;">
								<span class="text-sm" style="color: #64748b; margin-right: 0.5rem;"
									>{order.amount / 100 / 55}
									{order.amount / 100 / 55 === 1 ? 'Book' : 'Books'}</span
								>
								<span class="amount font-medium">&#8377; {order.amount / 100}</span>
							</div>
							<span
								class="badge {order.status === 'created'
									? 'badge-warning'
									: order.status === 'paid' || order.status === 'captured'
										? 'badge-success'
										: 'badge-neutral'}"
							>
								{order.status}
							</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="recent-empty">No recent orders yet.</p>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
		min-height: 100vh;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		min-height: 100vh;
		padding: 2rem 1rem;
	}

	.product-card {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-radius: 24px;
		padding: 2.5rem 2rem;
		text-align: center;
		width: 100%;
		max-width: 400px;
		box-shadow:
			0 20px 40px rgba(0, 0, 0, 0.08),
			0 1px 3px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.5);
		transform: translateY(20px);
		opacity: 0;
		animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.header-section {
		margin-bottom: 2rem;
	}

	.header-section h2 {
		color: #111827;
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		letter-spacing: -0.025em;
	}

	.subtitle {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0;
	}

	.counter-section {
		background: rgba(243, 244, 246, 0.5);
		border-radius: 16px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(229, 231, 235, 0.5);
	}

	.input-label {
		color: #374151;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 1rem;
	}

	.counter-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
	}

	.counter-btn {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		width: 44px;
		height: 44px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #374151;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.counter-btn:hover {
		border-color: #d1d5db;
		background: #f9fafb;
		transform: translateY(-1px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
	}

	.counter-btn:active {
		transform: translateY(0);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.counter-value {
		font-size: 2.5rem;
		font-weight: 700;
		color: #111827;
		min-width: 2ch;
		display: inline-block;
		font-variant-numeric: tabular-nums;
	}

	.buy-btn {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #111827;
		color: white;
		border: none;
		border-radius: 9999px;
		padding: 1.25rem 1.5rem;
		width: 100%;
		font-size: 1.125rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.buy-btn:hover {
		background: #1f2937;
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.buy-btn:active {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.buy-btn.disabled {
		opacity: 0.7;
		cursor: not-allowed;
		transform: none !important;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
		background: #111827; /* ensure bg doesnt change on hover */
	}

	.price-badge {
		background: rgba(255, 255, 255, 0.25);
		padding: 0.35rem 1rem;
		border-radius: 9999px;
		font-weight: 700;
		font-size: 1.25rem;
	}

	/* Recent Orders Styles */
	.recent-orders-card {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-radius: 24px;
		padding: 1.5rem 2rem;
		width: 100%;
		max-width: 400px;
		box-sizing: border-box;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.5);
		animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
		opacity: 0;
	}

	.recent-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		border-bottom: 1px solid #e2e8f0;
		padding-bottom: 0.75rem;
	}

	.recent-header h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1e293b;
		margin: 0;
	}

	.refresh-btn-small {
		background: transparent;
		border: none;
		color: #64748b;
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		transition: color 0.2s;
	}

	.refresh-btn-small:hover {
		color: #0f172a;
	}

	.refresh-btn-small.spinning svg {
		animation: spin 1s linear infinite;
	}

	.recent-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.recent-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: #f8fafc;
		border-radius: 12px;
		transition: background 0.2s;
	}

	.recent-item:hover {
		background: #f1f5f9;
	}

	.recent-info {
		display: flex;
		flex-direction: column;
		text-align: left;
		gap: 0.25rem;
	}

	.recent-id {
		color: #1e293b;
	}

	.font-mono {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
	}

	.text-sm {
		font-size: 0.875rem;
	}

	.recent-date {
		font-size: 0.75rem;
		color: #64748b;
	}

	.recent-status-amount {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.35rem;
	}

	.amount {
		color: #0f172a;
	}

	.font-medium {
		font-weight: 500;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.badge-success {
		background: #dcfce7;
		color: #166534;
	}
	.badge-warning {
		background: #fef3c7;
		color: #92400e;
	}
	.badge-neutral {
		background: #f1f5f9;
		color: #475569;
	}

	.recent-empty {
		text-align: center;
		color: #64748b;
		font-size: 0.875rem;
		padding: 1rem 0;
		margin: 0;
	}

	/* Mobile Responsiveness */
	@media (max-width: 480px) {
		.product-card {
			padding: 2rem 1.5rem;
			border-radius: 20px;
		}

		.header-section h2 {
			font-size: 1.25rem;
		}

		.counter-section {
			padding: 1.25rem 1rem;
		}

		.counter-container {
			gap: 1rem;
		}

		.counter-btn {
			width: 40px;
			height: 40px;
		}

		.counter-value {
			font-size: 2rem;
		}

		.buy-btn {
			padding: 1rem 1.25rem;
			font-size: 1rem;
		}

		.price-badge {
			font-size: 1.1rem;
			padding: 0.25rem 0.75rem;
		}

		.recent-orders-card {
			padding: 1.25rem 1rem;
			border-radius: 20px;
		}

		.recent-item {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.recent-status-amount {
			flex-direction: row-reverse;
			justify-content: space-between;
			align-items: center;
		}
	}

	/* Animations */
	@keyframes slideUpFade {
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
			color: #3b82f6;
		}
		100% {
			transform: scale(1);
		}
	}

	.pop-animation {
		animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}

	.shake-animation {
		animation: shake 0.3s linear;
	}
</style>
