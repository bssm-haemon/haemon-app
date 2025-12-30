# Frontend Style Reference — Pokemon Go–like Service

## 1. Overall Vibe

- Mood: Playful, adventurous, outdoor, friendly
- Emotional tone: optimistic, energetic, discovery-driven
- Brand feeling: fun but trustworthy, casual but polished

Keywords: playful, bright, rounded, friendly, dynamic, map-centric

---

## 2. Color Palette

Primary colors:

- Blue (primary action): #2A75BB
- Yellow (accent): #FFCB05
- Red (alert / important): #E3350D
- Green (success / capture): #4CAF50

Backgrounds:

- Map background: natural greens/blues (desaturated)
- UI background: #FFFFFF or #F3F4F6

Text:

- Primary text: #1F2937
- Secondary text: #6B7280

Avoid:

- Dark mode by default
- Neon / cyberpunk colors
- High-contrast black backgrounds

---

## 3. Typography

- Font family: Rounded sans-serif (e.g., Inter Rounded, Nunito, SF Pro Rounded)
- Base font size: 15–16px
- Headings: bold, friendly, slightly larger tracking
- Numbers / stats: tabular, clear legibility

Tone:

- Friendly wording, short sentences, simple language

---

## 4. Layout

- Mobile-first design (portrait orientation prioritized)
- Map is always primary visual element
- UI floats on top of the map (bottom sheets, floating buttons)

Spacing:

- Section padding: 12–16px (mobile)
- Card padding: 12px
- Large action areas (thumb reachable)

Max width (tablet/web):

- 480px (mobile view)
- 768px (tablet)
- 1200px (web)

---

## 5. Shapes & Surfaces

- Corners: rounded-xl (16px) for cards, rounded-full for buttons
- Shadows: soft and subtle
- No sharp edges, no flat brutalist UI

---

## 6. UI Components

### Buttons

- Shape: pill (rounded-full)
- Primary: blue filled (#2A75BB)
- Secondary: white with blue border
- Icon buttons: circular, floating
- Hover / active: scale 0.96 + darker shade

### Cards / Panels

- Floating cards above map
- White background, soft shadow
- Rounded corners

### Bottom Sheet

- Rounded top corners
- Swipeable / draggable
- Used for details, inventory, actions

---

## 7. Motion & Animation

- Duration: 200–300ms
- Easing: ease-out or spring
- Use motion to reinforce discovery and feedback

Examples:

- Capture animation: bounce + glow
- Panel open: slide-up + fade-in
- Button press: scale-down

Avoid:

- Long animations
- Heavy blur effects
- Excessive transitions

---

## 8. Iconography & Graphics

- Style: flat, friendly, colorful
- Stroke: medium thickness
- Icons must feel playful, not corporate

---

## 9. Map Interaction

- Map is always interactive unless blocked by modal
- Pins / creatures should animate subtly (idle motion)
- Highlight nearby items with pulsing ring

---

## 10. Sound & Haptics (if applicable)

- Short positive feedback sounds
- Soft vibration on important actions

Avoid:

- Loud, harsh, or long sounds

---

## 11. Things to Avoid

- Glassmorphism
- Dark fantasy / cyberpunk aesthetics
- Sharp rectangles
- Heavy text density
- Complex enterprise-style UI

---

## 12. Technical Constraints

- Framework: Next.js / React Native / Flutter
- Styling: Tailwind / CSS variables
- Animation: Framer Motion / Reanimated
- Map: Mapbox or Google Maps

---

## 13. Design Philosophy

The UI should:

- Encourage exploration
- Feel light and joyful
- Never distract from the map or real-world context
- Be understandable within 1 second of glance

If unsure, prioritize:
clarity > playfulness > decoration.
