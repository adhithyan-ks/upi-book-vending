<script>
	import { invalidateAll } from '$app/navigation';
	let { data } = $props();

	// Filter state
	let dateFilter = $state('all'); // 'all', 'today', '7days', '30days'
	let statusFilter = $state('all'); // 'all', 'paid', 'created'
	let isRefreshing = $state(false);

	async function handleRefresh() {
		isRefreshing = true;
		try {
			await invalidateAll();
		} finally {
			// Small delay so the spin animation is visible even if local
			setTimeout(() => {
				isRefreshing = false;
			}, 500);
		}
	}

	// Helper to parse the timestamp format provided (e.g., 2026-02-24 07:09:38.36904+00)
	function parsePostgresDate(dateStr) {
		if (!dateStr) return null;
		// The string is already close to ISO 8601, but we can ensure JS parses it correctly
		// by converting "YYYY-MM-DD HH:MM:SS.SSS+ZZ" to "YYYY-MM-DDTHH:MM:SS.SSSZ"
		let isoStr = dateStr;
		if (isoStr.includes(' ')) {
			isoStr = isoStr.replace(' ', 'T');
		}
		// If it ends with +00, replace with Z for UTC to be safe
		if (isoStr.endsWith('+00')) {
			isoStr = isoStr.slice(0, -3) + 'Z';
		}
		return new Date(isoStr);
	}

	function formatDateForDisplay(dateStr) {
		const date = parsePostgresDate(dateStr);
		if (!date || isNaN(date.getTime())) return 'N/A';

		return date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Filter logic
	let filteredOrders = $derived.by(() => {
		let result = data.orders;

		// Status filter
		if (statusFilter !== 'all') {
			if (statusFilter === 'paid') {
				result = result.filter((o) => o.status === 'paid' || o.status === 'captured');
			} else {
				result = result.filter((o) => o.status === statusFilter);
			}
		}

		// Date filter
		if (dateFilter !== 'all') {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			result = result.filter((order) => {
				const orderDate = parsePostgresDate(order.created_at);
				if (!orderDate) return false;

				if (dateFilter === 'today') {
					const orderDay = new Date(
						orderDate.getFullYear(),
						orderDate.getMonth(),
						orderDate.getDate()
					);
					return orderDay.getTime() === today.getTime();
				} else if (dateFilter === '7days') {
					const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
					return orderDate >= sevenDaysAgo;
				} else if (dateFilter === '30days') {
					const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
					return orderDate >= thirtyDaysAgo;
				}
				return true;
			});
		}

		return result;
	});

	// Derived statistics based on FILTERED orders
	let totalOrders = $derived(filteredOrders.length);

	let totalRevenue = $derived(
		filteredOrders.reduce((sum, order) => {
			if (order.status === 'paid' || order.status === 'captured') {
				return sum + order.amount / 100;
			}
			return sum;
		}, 0)
	);

	let totalItems = $derived(
		filteredOrders.reduce((sum, order) => {
			if (order.status === 'paid' || order.status === 'captured') {
				return sum + order.amount / 100 / 55;
			}
			return sum;
		}, 0)
	);
</script>

<svelte:head>
	<title>Order Dashboard</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="dashboard-wrapper">
	<div class="header">
		<div class="header-text">
			<h1>Order Dashboard</h1>
			<p class="subtitle">Overview of all transactions and sales.</p>
		</div>

		<div class="controls fade-in">
			<button
				class="refresh-btn"
				class:spinning={isRefreshing}
				onclick={handleRefresh}
				aria-label="Refresh orders"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-1.36" /></svg
				>
				<span>Refresh</span>
			</button>
			<div class="filter-group">
				<label for="status-filter">Status:</label>
				<select id="status-filter" bind:value={statusFilter}>
					<option value="all">All</option>
					<option value="paid">Paid</option>
					<option value="created">Unpaid</option>
				</select>
			</div>
			<div class="filter-group">
				<label for="date-filter">Timeframe:</label>
				<select id="date-filter" bind:value={dateFilter}>
					<option value="all">All Time</option>
					<option value="today">Today</option>
					<option value="7days">Last 7 Days</option>
					<option value="30days">Last 30 Days</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Statistics Section -->
	<div class="stats-grid">
		<div class="stat-card fade-in" style="--delay: 0.1s">
			<div class="stat-icon revenue">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="12" y1="1" x2="12" y2="23"></line><path
						d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
					></path></svg
				>
			</div>
			<div class="stat-content">
				<p class="stat-label">Revenue</p>
				<h3 class="stat-value">
					&#8377; {totalRevenue.toLocaleString('en-IN', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</h3>
			</div>
		</div>

		<div class="stat-card fade-in" style="--delay: 0.2s">
			<div class="stat-icon orders">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline
						points="14 2 14 8 20 8"
					></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line
						x1="16"
						y1="17"
						x2="8"
						y2="17"
					></line><polyline points="10 9 9 9 8 9"></polyline></svg
				>
			</div>
			<div class="stat-content">
				<p class="stat-label">Orders</p>
				<h3 class="stat-value">{totalOrders}</h3>
			</div>
		</div>

		<div class="stat-card fade-in" style="--delay: 0.3s">
			<div class="stat-icon items">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
					></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line
						x1="12"
						y1="22.08"
						x2="12"
						y2="12"
					></line></svg
				>
			</div>
			<div class="stat-content">
				<p class="stat-label">Items Sold</p>
				<h3 class="stat-value">{totalItems}</h3>
			</div>
		</div>
	</div>

	<!-- Orders Table -->
	<div class="table-container fade-in" style="--delay: 0.4s">
		{#if filteredOrders.length > 0}
			<div class="table-responsive">
				<table>
					<thead>
						<tr>
							<th>Order ID & Receipt</th>
							<th>Payment ID</th>
							<th>Date</th>
							<th class="text-right">Quantity</th>
							<th class="text-right">Amount</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredOrders as order (order.order_id || order.id)}
							<tr>
								<td>
									<div class="cell-primary font-mono text-sm">{order.order_id || order.id}</div>
									<div class="cell-secondary">{order.receipt || 'No receipt ID'}</div>
								</td>
								<td>
									<div class="cell-primary font-mono text-sm" style="color: #64748b;">
										{order.payment_id || 'N/A'}
									</div>
								</td>
								<td>
									<div class="cell-primary">{formatDateForDisplay(order.created_at)}</div>
								</td>
								<td class="text-right">
									<span class="badge badge-neutral">{order.amount / 100 / 55}</span>
								</td>
								<td class="text-right font-medium">
									&#8377; {(order.amount / 100).toLocaleString('en-IN', {
										minimumFractionDigits: 2
									})}
								</td>
								<td>
									<span
										class="badge {order.status === 'created'
											? 'badge-warning'
											: order.status === 'paid' || order.status === 'captured'
												? 'badge-success'
												: 'badge-neutral'}"
									>
										{order.status || 'unknown'}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="empty-state">
				<div class="empty-icon">
					<svg
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						><path
							d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
						></path></svg
					>
				</div>
				<p class="empty-message">No orders found.</p>
				<p class="empty-subtext">Try changing your filters or check back later.</p>
			</div>
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
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		min-height: 100vh;
		color: #1e293b;
	}

	.dashboard-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 1.5rem;
		box-sizing: border-box;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.header h1 {
		font-size: 2.25rem;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 0.5rem 0;
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 1rem;
		color: #64748b;
		margin: 0;
	}

	/* Controls */
	.controls {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.6);
		padding: 0.75rem 1.25rem;
		border-radius: 16px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.refresh-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		color: #475569;
		font-family: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.refresh-btn:hover {
		background: #f8fafc;
		border-color: #cbd5e1;
		color: #0f172a;
	}

	.refresh-btn:active {
		transform: scale(0.97);
	}

	.refresh-btn svg {
		transition: transform 0.3s;
	}

	.refresh-btn.spinning svg {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-left: 1rem;
		border-left: 1px solid #e2e8f0;
	}

	.filter-group label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.filter-group select {
		appearance: none;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 0.5rem 2.5rem 0.5rem 1rem;
		font-family: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		color: #0f172a;
		cursor: pointer;
		outline: none;
		transition: border-color 0.2s;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
	}

	.filter-group select:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.stat-card {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 20px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.25rem;
		box-shadow:
			0 10px 25px rgba(0, 0, 0, 0.03),
			0 4px 6px rgba(0, 0, 0, 0.02);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-3px);
		box-shadow:
			0 15px 35px rgba(0, 0, 0, 0.05),
			0 5px 10px rgba(0, 0, 0, 0.03);
	}

	.stat-icon {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stat-icon.revenue {
		background: #dcfce7;
		color: #16a34a;
	}
	.stat-icon.orders {
		background: #dbeafe;
		color: #2563eb;
	}
	.stat-icon.items {
		background: #fae8ff;
		color: #c026d3;
	}

	.stat-content {
		flex: 1;
	}

	.stat-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #64748b;
		margin: 0 0 0.25rem 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
		color: #0f172a;
		margin: 0;
		line-height: 1.2;
	}

	/* Table Container */
	.table-container {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 24px;
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.04),
			0 1px 3px rgba(0, 0, 0, 0.02);
		overflow: hidden;
	}

	.table-responsive {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		text-align: left;
		min-width: 800px; /* Forces scroll on very small screens to preserve layout */
	}

	th {
		background: rgba(248, 250, 252, 0.6);
		padding: 1rem 1.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #64748b;
		border-bottom: 1px solid #e2e8f0;
		white-space: nowrap;
	}

	td {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #f1f5f9;
		vertical-align: middle;
	}

	tr:last-child td {
		border-bottom: none;
	}

	tr:hover td {
		background: rgba(248, 250, 252, 0.4);
	}

	.cell-primary {
		color: #1e293b;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.cell-secondary {
		color: #64748b;
		font-size: 0.875rem;
	}

	.font-mono {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
	}

	.text-sm {
		font-size: 0.875rem;
	}
	.text-right {
		text-align: right;
	}
	.font-medium {
		font-weight: 500;
	}

	/* Badges */
	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
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

	/* Empty State */
	.empty-state {
		padding: 5rem 2rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.empty-icon {
		color: #cbd5e1;
		margin-bottom: 1rem;
	}

	.empty-message {
		font-size: 1.25rem;
		font-weight: 600;
		color: #334155;
		margin: 0 0 0.5rem 0;
	}

	.empty-subtext {
		color: #64748b;
		margin: 0;
	}

	/* Animations */
	.fade-in {
		opacity: 0;
		transform: translateY(15px);
		animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: var(--delay, 0s);
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Mobile Adjustments */
	@media (max-width: 768px) {
		.dashboard-wrapper {
			padding: 2rem 1rem;
		}

		.header h1 {
			font-size: 1.75rem;
		}

		.header {
			flex-direction: column;
			align-items: flex-start;
		}

		.controls {
			width: 100%;
			box-sizing: border-box;
			flex-wrap: wrap;
			gap: 0.5rem;
			padding: 0.5rem 1rem;
		}

		.refresh-btn {
			flex: 1;
			justify-content: center;
		}

		.filter-group {
			flex: 2;
			justify-content: space-between;
			width: 100%;
			padding-left: 0;
			border-left: none;
		}

		.filter-group select {
			flex: 1;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.controls {
			flex-direction: column;
			align-items: stretch;
		}
		.refresh-btn {
			padding: 0.75rem 1rem;
		}
		.filter-group {
			border-top: 1px solid #e2e8f0;
			padding-top: 0.5rem;
		}

		.table-container {
			border-radius: 16px;
		}

		.stat-card {
			padding: 1.25rem;
		}

		.stat-value {
			font-size: 1.5rem;
		}
	}
</style>
