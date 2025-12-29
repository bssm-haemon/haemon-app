// User
export interface User {
  id: string;
  email: string;
  nickname: string;
  points: number;
  level: number;
  achievements: Achievement[];
  createdAt: string;
}

// Creature (생물)
export interface Creature {
  id: string;
  name: string;
  rarity: "common" | "rare" | "legend";
  imageUrl: string;
  description?: string;
}

// Sighting (목격 기록)
export interface Sighting {
  id: string;
  userId: string;
  creatureId: string;
  creature?: Creature;
  photoUrl: string;
  lat: number;
  lng: number;
  memo?: string;
  status: "pending" | "approved" | "rejected";
  points: number;
  createdAt: string;
}

// Cleanup (쓰레기 수거)
export interface Cleanup {
  id: string;
  userId: string;
  beforePhoto: string;
  afterPhoto: string;
  trashType: string;
  amount: number;
  lat: number;
  lng: number;
  points: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Achievement (업적/뱃지)
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;
}

// Feed Item
export interface FeedItem {
  id: string;
  type: "sighting" | "cleanup";
  userId: string;
  userNickname: string;
  content: Sighting | Cleanup;
  createdAt: string;
}
