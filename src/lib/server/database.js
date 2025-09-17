// Import the new admin client
import { supabaseAdmin } from './supabaseAdminClient';

/**
 * Saves a newly created order to the Supabase database.
 * @param {object} order - The order details.
 */
export async function saveOrder(order) {
	// Use the admin client to bypass RLS for this trusted server operation
	const { error } = await supabaseAdmin.from('orders').insert([order]);

	if (error) {
		console.error('Supabase error saving order:', error);
		throw new Error('Failed to save order to the database.');
	}
}

/**
 * Updates an existing order in Supabase with new details.
 * @param {string} orderId - The Razorpay order ID.
 * @param {object} updates - An object with the fields to update.
 */
export async function updateOrder(orderId, updates) {
	// Use the admin client here as well
	const { error } = await supabaseAdmin
		.from('orders')
		.update(updates)
		.eq('order_id', orderId);

	if (error) {
		console.error('Supabase error updating order:', error);
		throw new Error('Failed to update order in the database.');
	}
}