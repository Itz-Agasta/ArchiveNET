import { Heap } from "heap-js";
import type { Node, Point } from "../types";

/**
 * HNSW Utility Functions
 * =====================
 *
 * This module provides utility functions and data structures used by the HNSW algorithm,
 * including distance functions, heap data structures, and vector operations.
 */

/**
 * A specialized min-heap for Node types used in HNSW search algorithms.
 *
 * This heap automatically sorts nodes by their distance values (first element of the tuple).
 * It's used extensively in the search algorithms to maintain candidate lists and results.
 *
 */
export class NodeHeap extends Heap<Node> {
	constructor(elems: Node[] = []) {
		super(compareNode);
		if (elems.length !== 0) {
			super.addAll(elems);
		}
	}
}

/**
 * Comparator function for Node types that compares by distance.
 *
 * Used by the NodeHeap to maintain proper ordering. Compares the first element
 * of the Node tuple (the distance value).
 *
 * @param a First node to compare
 * @param b Second node to compare
 * @returns Negative if a < b, positive if a > b, zero if equal
 */
export function compareNode(a: Node, b: Node) {
	return a[0] - b[0];
}

/**
 * Computes the dot product (inner product) of two vectors.
 *
 * The dot product measures the cosine of the angle between vectors scaled by their magnitudes.
 * It's a fundamental operation used in many distance calculations.
 *
 * @param a First vector
 * @param b Second vector
 * @returns The dot product (sum of element-wise products)
 */
export function dot_product(a: Point, b: Point): number {
	return a.reduce((sum, val, idx) => sum + val * b[idx], 0);
}

/**
 * Computes the Euclidean norm (magnitude) of a vector.
 *
 * The norm represents the length of the vector in Euclidean space.
 * It's used in cosine distance calculations and vector normalization.
 *
 * @param a The vector to compute the norm for
 * @returns The Euclidean norm (square root of sum of squared elements)
 */
export function norm(a: Point): number {
	return Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Computes the cosine distance between two vectors.
 *
 * Cosine distance is defined as 1 - cosine_similarity, where cosine similarity
 * is the dot product of normalized vectors. This distance measure is particularly
 * useful for high-dimensional data as it focuses on the angle between vectors
 * rather than their magnitudes.
 *
 * Range: [0, 2] where:
 * - 0 = vectors point in same direction (most similar)
 * - 1 = vectors are orthogonal (no correlation)
 * - 2 = vectors point in opposite directions (most dissimilar)
 *
 * @param a First vector
 * @param b Second vector
 * @returns The cosine distance between the vectors
 */
export function cosine_distance(a: Point, b: Point): number {
	return 1 - dot_product(a, b) / (norm(a) * norm(b));
}

/**
 * Alias for dot_product function.
 *
 * Provided for API consistency and mathematical terminology preferences.
 *
 * @param a First vector
 * @param b Second vector
 * @returns The inner product of the vectors
 */
export function inner_product(a: Point, b: Point): number {
	return dot_product(a, b);
}

/**
 * Computes the Euclidean (L2) distance between two vectors.
 *
 * This is the "straight-line" distance between points in Euclidean space.
 * It's sensitive to the magnitude of vectors and can suffer from the curse
 * of dimensionality in high-dimensional spaces.
 *
 * @param a First vector
 * @param b Second vector
 * @returns The Euclidean distance between the vectors
 *
 * @note Fixed implementation - corrects the parentheses placement for proper calculation
 */
export function l2_distance(a: Point, b: Point): number {
	return Math.sqrt(a.reduce((sum, val, idx) => sum + (val - b[idx]) ** 2, 0));
}
