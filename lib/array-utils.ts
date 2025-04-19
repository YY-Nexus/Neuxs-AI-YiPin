/**
 * Safely swaps two elements in an array
 * @param array The array to modify
 * @param indexA Index of the first element
 * @param indexB Index of the second element
 * @returns The modified array (same reference)
 */
export function swapArrayElements<T>(array: T[], indexA: number, indexB: number): T[] {
  // Validate indices
  if (indexA < 0 || indexB < 0 || indexA >= array.length || indexB >= array.length || indexA === indexB) {
    return array
  }

  // Perform the swap using a temporary variable
  const temp = array[indexA]
  array[indexA] = array[indexB]
  array[indexB] = temp

  return array
}

/**
 * Moves an element in an array to a new position
 * @param array The array to modify
 * @param fromIndex Current index of the element
 * @param toIndex Desired index for the element
 * @returns The modified array (same reference)
 */
export function moveArrayElement<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  // Validate indices
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= array.length || toIndex >= array.length || fromIndex === toIndex) {
    return array
  }

  // Remove the element from its current position
  const element = array[fromIndex]
  array.splice(fromIndex, 1)

  // Insert the element at the new position
  array.splice(toIndex, 0, element)

  return array
}
