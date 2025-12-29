// 해양 생물 정적 데이터
export type CreatureCategory =
    | "cetacean"    // 고래류
    | "turtle"      // 거북류
    | "pinniped"    // 기각류 (물개, 바다사자)
    | "fish"        // 어류
    | "jellyfish"   // 해파리류
    | "crustacean"  // 갑각류
    | "mollusk"     // 연체류
    | "bird";       // 조류

export type Rarity = "common" | "rare" | "legendary";

export interface StaticCreature {
    id: string;
    name: string;
    name_en: string;
    category: CreatureCategory;
    description: string;
    image_path: string; // public 폴더 기준 경로
    rarity: Rarity;
    points: number;
}

// 정적 생물 데이터 (프론트엔드에 하드코딩)
export const STATIC_CREATURES: StaticCreature[] = [
    // === 일반 (Common) - 30 포인트 ===
    {
        id: "creature-001",
        name: "고등어",
        name_en: "Mackerel",
        category: "fish",
        description: "한국 연안에서 흔히 볼 수 있는 등푸른 생선입니다.",
        image_path: "/poketmon/고등어.png",
        rarity: "common",
        points: 30,
    },
    {
        id: "creature-002",
        name: "꽁치",
        name_en: "Pacific Saury",
        category: "fish",
        description: "가을철 대표 생선으로 긴 몸통이 특징입니다.",
        image_path: "/poketmon/꽁치.png",
        rarity: "common",
        points: 30,
    },
    {
        id: "creature-003",
        name: "가자미",
        name_en: "Flounder",
        category: "fish",
        description: "바다 바닥에 몸을 붙이고 사는 납작한 흰살 생선입니다.",
        image_path: "/poketmon/가자미.png",
        rarity: "common",
        points: 30,
    },

    // === 희귀 (Rare) - 80 포인트 ===
    {
        id: "creature-004",
        name: "복어",
        name_en: "Pufferfish",
        category: "fish",
        description: "위험을 느끼면 몸을 부풀리는 독을 가진 물고기입니다.",
        image_path: "/poketmon/복어.png",
        rarity: "rare",
        points: 80,
    },
    {
        id: "creature-005",
        name: "오징어",
        name_en: "Squid",
        category: "mollusk",
        description: "10개의 다리를 가진 연체동물입니다.",
        image_path: "/poketmon/오징어.png",
        rarity: "rare",
        points: 80,
    },
    {
        id: "creature-006",
        name: "문어",
        name_en: "Octopus",
        category: "mollusk",
        description: "8개의 다리와 높은 지능을 가진 연체동물입니다.",
        image_path: "/poketmon/문어.png",
        rarity: "rare",
        points: 80,
    },
    {
        id: "creature-007",
        name: "해마",
        name_en: "Seahorse",
        category: "fish",
        description: "말처럼 생긴 독특한 외형의 물고기입니다.",
        image_path: "/poketmon/해마.png",
        rarity: "rare",
        points: 80,
    },
    {
        id: "creature-008",
        name: "바다거북",
        name_en: "Sea Turtle",
        category: "turtle",
        description: "바다를 유유히 헤엄치는 장수의 상징입니다.",
        image_path: "/poketmon/바다거북.png",
        rarity: "rare",
        points: 80,
    },

    // === 전설 (Legendary) - 150 포인트 ===
    {
        id: "creature-009",
        name: "돌고래",
        name_en: "Dolphin",
        category: "cetacean",
        description: "높은 지능과 사회성을 가진 해양 포유류입니다.",
        image_path: "/poketmon/돌고래.png",
        rarity: "legendary",
        points: 150,
    },
    {
        id: "creature-010",
        name: "점박이물범",
        name_en: "Spotted Seal",
        category: "pinniped",
        description: "점무늬가 특징인 북태평양의 귀여운 바다 포유류입니다.",
        image_path: "/poketmon/점박이물범.png",
        rarity: "legendary",
        points: 150,
    },
    {
        id: "creature-011",
        name: "고래상어",
        name_en: "Whale Shark",
        category: "fish",
        description: "세계에서 가장 큰 물고기이자 온순한 필터 피더입니다.",
        image_path: "/poketmon/고래상어.png",
        rarity: "legendary",
        points: 150,
    },
];

// 유틸리티 함수들
export const getCreatureById = (id: string) =>
    STATIC_CREATURES.find(c => c.id === id);

export const getCreaturesByRarity = (rarity: Rarity) =>
    STATIC_CREATURES.filter(c => c.rarity === rarity);

export const getCreaturesByCategory = (category: CreatureCategory) =>
    STATIC_CREATURES.filter(c => c.category === category);

export const getTotalCreatureCount = () => STATIC_CREATURES.length;

export const getCreatureCountByRarity = (rarity: Rarity) =>
    STATIC_CREATURES.filter(c => c.rarity === rarity).length;
