/**
 * Type definitions for HNSW (Hierarchical Navigable Small World) implementation
 *
 * These types define the core data structures used throughout the HNSW algorithm.
 */

/**
 * A point in high-dimensional space, represented as an array of numbers.
 *
 * Each number represents the coordinate value in one dimension.
 * All points in an HNSW index should have the same dimensionality.
 */
export type Point = number[];

/**
 * Represents the graph structure for a single layer in the HNSW index.
 *
 * Maps point indices to their neighbor information (LayerNode).
 * Each key is a point index, and each value contains that point's connections.
 */
export type Graph = Record<number, LayerNode>;

/**
 * Represents all neighbors of a single point in a layer.
 *
 * Maps neighbor point indices to their distances from this point.
 * The distances are used for efficient neighbor traversal during search.
 */
export type LayerNode = Record<number, number>;

/**
 * A tuple representing a point with its distance from a query.
 *
 * Used throughout the search algorithms to track candidates and results.
 * The first element is the distance, the second is the point's index.
 * This format allows efficient sorting by distance.
 */
export type Node = [distance: number, id: number];

/**
 * Result object returned by k-nearest neighbor search.
 *
 * Contains the point index, its distance from the query, and any associated metadata.
 * The metadata can be any type (specified via the generic parameter M).
 *
 * @template M The type of metadata associated with points (e.g., string, object, etc.)
 */
export type KNNResult<M = unknown> = {
	/** The unique index/ID of the point in the HNSW index */
	id: number;
	/** The distance from the query point (lower = more similar) */
	distance: number;
	/** Optional metadata associated with this point */
	metadata: M | null;
};
