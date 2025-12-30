// User
export interface User {
  id: string;
  email: string;
  nickname: string;
  profile_image: string;
  points: number;
  is_admin: boolean;
  created_at: string;
  sighting_count?: number;
  cleanup_count?: number;
  creature_count?: number;
  badge_count?: number;
}

// Creature (생물)
export type CreatureCategory = 'cetacean' | 'turtle' | 'pinniped' | 'fish' | 'jellyfish' | 'crustacean' | 'mollusk' | 'bird';
export type Rarity = 'common' | 'rare' | 'legendary';

export interface Creature {
  id: string;
  name: string;
  name_en: string;
  summary?: string;
  category: CreatureCategory;
  description: string;
  image_url: string;
  rarity: Rarity;
  points: number;
  created_at?: string;
}

// Sighting (목격 기록)
export interface Sighting {
  id: string;
  user_id: string;
  creature_id: string | null;
  photo_url: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  memo?: string;
  image_hash: string;
  ai_suggestion?: string;
  ai_confidence?: number;
  status: "pending" | "approved" | "rejected";
  points_earned: number;
  created_at: string;
  user_nickname?: string;
  creature_name?: string;
}

// Cleanup (쓰레기 수거)
export type TrashType = 'plastic' | 'styrofoam' | 'fishing_gear' | 'glass' | 'metal' | 'other';
export type CleanupAmount = 'handful' | 'one_bag' | 'large';

export interface Cleanup {
  id: string;
  user_id: string;
  before_photo_url: string;
  after_photo_url: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  trash_type: TrashType;
  amount: CleanupAmount;
  before_image_hash: string;
  after_image_hash: string;
  ai_verified: boolean;
  ai_confidence: number;
  status: "pending" | "approved" | "rejected";
  points_earned: number;
  created_at: string;
}

// Badge (뱃지)
export interface Badge {
  id: string;
  name: string;
  name_ko?: string;
  description: string;
  condition_type: string;
  condition_value: number;
  created_at?: string;
}

export interface MyBadge {
  badge: Badge;
  earned_at: string;
}

// Collection
export interface CollectionItem {
  creature: Creature;
  discovered_at: string;
  first_sighting_id: string;
}

// Market
export interface MarketItem {
  creature_id: string;
  name: string;
  name_en: string;
  category: CreatureCategory;
  image_url: string;
  rarity: Rarity;
  price: number;
  in_aquarium: boolean;
}

// Aquarium
export interface AquariumItem {
  id: string;
  creature_id: string;
  creature_name: string;
  creature_image: string;
  rarity: Rarity;
  position_x: number;
  position_y: number;
  purchased_at: string;
}

// Ranking
export interface RankingItem {
  rank: number;
  user_id: string;
  nickname: string;
  profile_image: string;
  value: number;
}
