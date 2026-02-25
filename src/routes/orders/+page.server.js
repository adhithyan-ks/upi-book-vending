import { supabase } from '$lib/supabaseClient.js'; // Use the PUBLIC client for fetching data

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	console.log('Fetching orders from the database...');

	const { data: orders, error } = await supabase
		.from('orders') // The name of your table
		.select('*') // Select all columns
		.order('created_at', { ascending: false }); // Sort descending by newest first

	if (error) {
		console.error('Error fetching orders:', error);
		// Returning an error will show the nearest +error.svelte page
		// You can customize this as needed
		return { status: 500, error: 'Failed to fetch orders.' };
	}

	return {
		orders: orders ?? [] // Return the fetched orders, or an empty array if null
	};
}