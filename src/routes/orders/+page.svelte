<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>Order History</title>
</svelte:head>

<h1>Order History</h1>

{#if data.orders.length > 0}
	<table>
		<thead>
			<tr>
				<th>Order ID</th>
				<th>Status</th>
                <th>Quantity</th>
				<th>Amount</th>
				<th>Receipt</th>
                <th>Created At</th>
			</tr>
		</thead>
		<tbody>
			{#each data.orders as order (order.order_id)}
				<tr>
					<td>{order.order_id}</td>
					<td>{order.status}</td>
					<td>{(order.amount/100)/55}</td>
					<td>{(order.amount / 100).toFixed(2)} {order.currency}</td>
					<td>{order.receipt}</td>
					<td>{order.created_at}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>No orders found.</p>
{/if}

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th, td {
		border: 1px solid #ccc;
		padding: 8px;
		text-align: left;
	}
	th {
		background-color: #f2f2f2;
	}
</style>