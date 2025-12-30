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
    summary: string;     // 카드용 짧은 설명
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
        summary: "등푸른 바다 러너, 떼를 지어 빠르게 움직인다.",
        description: "타입: 물 / 속도형\n등푸른 근육질로 파도를 가르며 돌진하는 바다의 러너. 떼를 지어 다니며 순간 가속으로 포식자를 따돌리고, 빛을 반사하는 비늘로 상대를 혼란시킨다.",
        image_path: "/poketmon/고등어.png",
        rarity: "common",
        points: 30,
    },
    {
        id: "creature-002",
        name: "꽁치",
        name_en: "Pacific Saury",
        category: "fish",
        summary: "창처럼 길게 수면을 미끄러지는 민첩 어류.",
        description: "타입: 물 / 민첩형\n창처럼 뻗은 몸으로 수면 가까이를 미끄러지듯 이동한다. 달빛 아래 물 위로 솟구쳐 포식자를 피하는 특기 덕분에 '달빛 슈터'라는 별명이 있다.",
        image_path: "/poketmon/꽁치.png",
        rarity: "common",
        points: 30,
    },
    {
        id: "creature-003",
        name: "가자미",
        name_en: "Flounder",
        category: "fish",
        summary: "모래에 숨어 위장하는 납작한 잠행 사냥꾼.",
        description: "타입: 물 / 잠행형\n몸을 모래에 파묻고 양쪽 눈으로 위를 주시한다. 얕은 해저를 차지하며, '모래 위장' 기술로 모습을 감춰 적을 기습한다.",
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
        summary: "팽창해 가시와 독으로 버티는 바다의 방패.",
        description: "타입: 물 / 방어형\n위협을 받으면 순식간에 몸을 부풀려 가시를 드러낸다. '독성 가시'를 품어두어 섣불리 다가간 상대에게 역습을 가한다.",
        image_path: "/poketmon/복어.png",
        rarity: "rare",
        points: 80,
    },
    {
        id: "creature-005",
        name: "오징어",
        name_en: "Squid",
        category: "mollusk",
        summary: "먹물로 시야를 가리고 기민하게 움직이는 연체.",
        description: "타입: 물 / 에스퍼\n10개의 촉수로 상대를 얽어매며, 먹물을 뿜어 시야를 차단한다. '심해 텔레포트'라 불리는 순간 방향 전환으로 추격을 따돌린다.",
        image_path: "/poketmon/오징어.png",
        rarity: "rare",
        points: 80,
    },
    {
        id: "creature-006",
        name: "문어",
        name_en: "Octopus",
        category: "mollusk",
        summary: "색을 바꾸고 기습하는 지능 높은 촉수 사냥꾼.",
        description: "타입: 물 / 에스퍼\n지능이 높아 도구를 사용한다. '먹물 베일'로 전장을 암흑화하고, 색을 바꿔 위장한 뒤 한 방의 흡착 공격을 노린다.",
        image_path: "/poketmon/문어.png",
        rarity: "rare",
        points: 80,
    },
    {
        id: "creature-007",
        name: "해마",
        name_en: "Seahorse",
        category: "fish",
        summary: "해초 숲을 지키는 물/요정 계열의 파수꾼.",
        description: "타입: 물 / 요정\n말처럼 곧은 자세로 헤엄치며, 해초 숲을 지키는 수호자. '물방울 실드'로 팀원을 감싸고, 수면 위로 포말을 뿜어 적의 시야를 흐린다.",
        image_path: "/poketmon/해마.png",
        rarity: "rare",
        points: 80,
    },
    {
        id: "creature-008",
        name: "바다거북",
        name_en: "Sea Turtle",
        category: "turtle",
        summary: "두꺼운 등껍질로 돌진하는 장수 해양 수호자.",
        description: "타입: 물 / 바위\n두꺼운 등껍질로 파도를 깨며 돌진한다. '대지의 껍질'로 물리 공격을 튕겨내고, 긴 항해에서 축적한 내구력을 자랑한다.",
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
        summary: "초음파로 전장을 읽는 빠른 지휘관.",
        description: "타입: 물 / 에스퍼\n초음파를 발사해 전장을 스캔하고 동료와 교신한다. '소닉 웨이브'로 적을 혼란시켜 틈을 만든 뒤, 물기둥을 타고 순식간에 거리를 좁힌다.",
        image_path: "/poketmon/돌고래.png",
        rarity: "legendary",
        points: 150,
    },
    {
        id: "creature-010",
        name: "점박이물범",
        name_en: "Spotted Seal",
        category: "pinniped",
        summary: "점무늬 위장과 서리 숨결을 쓰는 얼음 수영수.",
        description: "타입: 물 / 얼음\n점무늬로 눈밭과 바다를 동시에 위장한다. '서리 숨결'로 주변 온도를 낮추고, 미끄러운 몸놀림으로 공격을 회피한 뒤 머리로 강하게 들이받는다.",
        image_path: "/poketmon/점박이물범.png",
        rarity: "legendary",
        points: 150,
    },
    {
        id: "creature-011",
        name: "고래상어",
        name_en: "Whale Shark",
        category: "fish",
        summary: "바다를 울리는 온순한 거대 필터 피더.",
        description: "타입: 물 / 거대\n바다를 통째로 진동시키는 거대한 존재. '플랑크톤 스톰'으로 주위 물을 휘몰아 필터처럼 빨아들이며, 거대한 몸으로 파도를 일으켜 적을 압도한다.",
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
