import type { SeatingSection } from '../types';

/**
 * Seating inventory must come from the configured venue database.
 * Do not show guessed availability or prices as bookable inventory.
 */
export const DEFAULT_SECTIONS: SeatingSection[] = [];
