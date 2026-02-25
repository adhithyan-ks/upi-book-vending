<svelte:head>
	<title>Payment Successful</title>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="wrapper">
	<div class="card">
		<div class="icon-container">
			<div class="circle"></div>
			<div class="check-mark"></div>
		</div>
		<h1 class="title">Payment Successful!</h1>
		<p class="description">Thank you for your purchase. Your transaction was completed successfully.</p>
		<a href="/" class="btn">Return to Home</a>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		min-height: 100vh;
	}

	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 1rem;
	}

	.card {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-radius: 24px;
		padding: 3rem 2rem;
		text-align: center;
		max-width: 420px;
		width: 100%;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.5);
		transform: translateY(20px);
		opacity: 0;
		animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.icon-container {
		position: relative;
		width: 80px;
		height: 80px;
		margin: 0 auto 1.5rem;
	}

	.circle {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: #22c55e;
		opacity: 0;
		transform: scale(0.5);
		animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards;
		box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
	}

	.check-mark {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 24px;
		height: 12px;
		border-left: 3px solid white;
		border-bottom: 3px solid white;
		transform: translate(-50%, -60%) rotate(-45deg);
		opacity: 0;
		animation: drawCheck 0.4s ease-out 0.6s forwards;
	}

	.title {
		color: #111827;
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
		letter-spacing: -0.025em;
	}

	.description {
		color: #4b5563;
		font-size: 1rem;
		line-height: 1.5;
		margin: 0 0 2rem;
	}

	.btn {
		display: inline-block;
		background: #111827;
		color: white;
		text-decoration: none;
		padding: 0.875rem 2rem;
		border-radius: 9999px;
		font-weight: 500;
		font-size: 1rem;
		transition: all 0.2s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.btn:hover {
		background: #1f2937;
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.btn:active {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	@keyframes slideUpFade {
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes popIn {
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes drawCheck {
		0% {
			opacity: 0;
			width: 0;
			height: 0;
		}
		50% {
			opacity: 1;
			width: 0;
			height: 12px;
		}
		100% {
			opacity: 1;
			width: 24px;
			height: 12px;
		}
	}
</style>