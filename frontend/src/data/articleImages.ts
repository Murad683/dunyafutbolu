/**
 * Varied article images sourced from Unsplash (free, no attribution required).
 * Each URL uses Unsplash source parameters for optimized delivery.
 */
export const ARTICLE_IMAGES: string[] = [
  // 0 — Stadium crowd shot
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
  // 1 — Player in action
  'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80',
  // 2 — Training session
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&q=80',
  // 3 — Trophy / celebration
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
  // 4 — Ball close-up
  'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&q=80',
  // 5 — Referee
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
  // 6 — Fans
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  // 7 — Night match under floodlights
  'https://vaishnav.lovestoblog.com/wp-content/uploads/2025/10/voetbal-3-algemene-foto-website.jpeg',
  // 8 — Goal moment
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
  // 9 — Manager on touchline
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
  // 10 — Penalty kick
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
  // 11 — Header duel
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
  // 12 — Team huddle
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80',
  // 13 — Transfer announcement (suited player)
  'https://images.unsplash.com/photo-1600679472829-3044539ce8ed?w=800&q=80',
  // 14 — Press conference
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
  // 15 — Aerial stadium view
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80',
];

/**
 * Returns a deterministic image for a given article ID so the same
 * article always shows the same image across renders.
 */
export function getArticleImage(id: number | string): string {
  const index = Math.abs(Number(id)) % ARTICLE_IMAGES.length;
  return ARTICLE_IMAGES[index];
}
