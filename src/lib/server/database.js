import fs from 'fs';
import { building } from '$app/environment';

const DB_PATH = 'orders.json';

// Initialize the JSON file if it doesn't exist.
// The `building` check prevents this from running during the build process.
if (!building && !fs.existsSync(DB_PATH)) {
	fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

/**
 * @returns {Array<any>}
 */
export function getOrders() {
	if (fs.existsSync(DB_PATH)) {
		const data = fs.readFileSync(DB_PATH, 'utf-8');
		return JSON.parse(data);
	}
	return [];
}

/**
 * @param {any} order
 */
export function saveOrder(order) {
	const orders = getOrders();
	orders.push(order);
	fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2));
}

/**
 * @param {string} orderId
 * @param {object} updates
 */
export function updateOrder(orderId, updates) {
	const orders = getOrders();
	const orderIndex = orders.findIndex((o) => o.order_id === orderId);
	if (orderIndex !== -1) {
		orders[orderIndex] = { ...orders[orderIndex], ...updates };
		fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2));
	}
}