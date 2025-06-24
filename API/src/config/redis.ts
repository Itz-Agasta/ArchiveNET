import { Redis } from "ioredis";

/**
 * Initializes Redis connection if REDIS_URL is provided
 *
 * Creates a resilient Redis connection with automatic reconnection capabilities.
 * The connection includes proper error handling, reconnection logic, and
 * connection monitoring for production stability.
 *
 * @returns Promise<Redis | undefined> - Redis instance if connection successful, undefined otherwise
 * @throws Never throws - all errors are caught and logged as warnings
 */
export async function initializeRedis(): Promise<Redis | undefined> {
	// Support both REDIS_URL (for production/external services) and individual config (for local/development)
	const redisUrl = process.env.REDIS_URL;
	const redisHost = process.env.REDIS_SERVER || process.env.REDIS_HOST || 'localhost';
	const redisPort = process.env.REDIS_PORT || '6379';
	const redisPassword = process.env.REDIS_AUTH_KEY || process.env.REDIS_PASSWORD;

	// If no Redis configuration is provided, skip Redis entirely
	if (!redisUrl && !redisHost) {
		console.log("No Redis configuration provided, proceeding without Redis cache");
		return undefined;
	}

	// Determine connection method and log appropriately
	if (redisUrl) {
		console.log(`Attempting to connect to Redis via URL: ${redisUrl.replace(/\/\/.*@/, '//*****@')}...`);
	} else {
		const isLocal = redisHost === 'localhost' || redisHost === '127.0.0.1';
		console.log(`Attempting to connect to ${isLocal ? 'LOCAL' : 'REMOTE'} Redis at ${redisHost}:${redisPort}...`);
	}

	let redis: Redis | undefined;

	try {
		// Create Redis connection - support both URL and individual config
		if (redisUrl) {
			// Use Redis URL (common for cloud services like Railway, Heroku, etc.)
			redis = new Redis(redisUrl, {
				connectTimeout: 10000,
				commandTimeout: 5000,
				lazyConnect: false,
				maxRetriesPerRequest: 2,
				enableAutoPipelining: true,
				enableReadyCheck: true,
				family: 4, // Use IPv4
			});
		} else {
			// Use individual config (for local Redis or custom setups)
			const isLocal = redisHost === 'localhost' || redisHost === '127.0.0.1';
			
			redis = new Redis({
				host: redisHost,
				port: parseInt(redisPort, 10),
				password: redisPassword,
				// Connection settings optimized for local vs remote
				connectTimeout: isLocal ? 5000 : 15000,
				commandTimeout: isLocal ? 3000 : 8000,
				lazyConnect: false,
				maxRetriesPerRequest: isLocal ? 1 : 3,
				enableAutoPipelining: true,
				enableReadyCheck: true,
				family: 4, // Use IPv4
				// Additional settings for remote Redis
				...((!isLocal) && {
					retryDelayOnFailover: 100,
					enableOfflineQueue: false,
				})
			});
		}

		// Track connection state to prevent spam
		let hasLoggedDisconnection = false;

		redis.on("ready", () => {
			console.log("✅ Redis connected successfully for caching");
			hasLoggedDisconnection = false; // Reset flag when connected
		});

		redis.on("error", (err) => {
			// Only log disconnect once until reconnection
			if (!hasLoggedDisconnection) {
				console.warn("⚠️ Redis connection lost");
				hasLoggedDisconnection = true;
			}
		});

		// Suppress other events (connect, reconnecting, close, end)

		// Test initial connection
		await redis.ping();
		console.log("Redis ping successful - connection established");

		return redis;
	} catch (error) {
		console.warn(
			"❌ Redis initial connection failed, proceeding without caching",
			error,
		);

		return redis;
	}
}
