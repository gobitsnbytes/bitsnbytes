// The active bits&bytes™ forks: one list for /fork, the globe, JSON-LD and copy. Name them, never count them.
// Leads only where we know them; add a city (or a lead) here and every surface picks it up.

export type Fork = { city: string; at: [lat: number, lng: number]; lead?: string };

export const FORKS: Fork[] = [
  { city: "Bangalore", at: [12.9716, 77.5946], lead: "Sparsh Sharma" },
  { city: "Kolkata", at: [22.5726, 88.3639], lead: "Shoryavardhaan Gupta" },
  { city: "Chennai", at: [13.0827, 80.2707] },
  { city: "Bhubaneswar", at: [20.2961, 85.8245] },
  { city: "Nagpur", at: [21.1458, 79.0882] },
  { city: "Mumbai", at: [19.076, 72.8777] },
  { city: "Delhi", at: [28.6139, 77.209] },
  { city: "Noida", at: [28.5355, 77.391], lead: "Aryan Chauhan" },
  { city: "Lucknow", at: [26.8467, 80.9462] },
  { city: "Hyderabad", at: [17.385, 78.4867], lead: "Shreethan Kagitha" },
];

/** "Bangalore, Kolkata, … Lucknow and Hyderabad" */
export const FORK_CITIES = `${FORKS.slice(0, -1)
  .map((fork) => fork.city)
  .join(", ")} and ${FORKS[FORKS.length - 1].city}`;
