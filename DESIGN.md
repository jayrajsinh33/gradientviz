# Design Brief

## Direction

**Data Science Dashboard for Gradient Descent** — A professional, academic visualization platform designed for students to explore ML optimization with crisp dark UI and vibrant chart-colored accents.

## Tone

Refined minimalism with scientific precision — dark, focused, and intentional. No decorative noise; every UI element serves the visualization or controls.

## Differentiation

Grid-subtle background and chart-colored highlights create a professional ML dashboard aesthetic (inspired by Jupyter/TensorBoard), evoking scientific credibility while remaining modern and accessible to students.

## Color Palette

| Token        | OKLCH              | Role                                 |
|--------------|-------------------|--------------------------------------|
| background   | 0.12 0.01 280     | Deep blue-black, near-neutral        |
| foreground   | 0.93 0.008 280    | Near-white, accessible text          |
| card         | 0.16 0.015 280    | Slightly elevated from background    |
| primary      | 0.65 0.22 265     | Vivid periwinkle (controls, focus)   |
| accent       | 0.68 0.22 145     | Electric green (optimization state)  |
| secondary    | 0.22 0.025 280    | Dark card borders                    |
| destructive  | 0.55 0.22 25      | Red for errors/divergence            |
| chart-1      | 0.72 0.2 265      | Purple loss line                     |
| chart-2      | 0.68 0.22 145     | Green convergence indicator          |
| chart-3      | 0.65 0.18 195     | Cyan gradient overlay                |
| chart-4      | 0.75 0.2 190      | Teal secondary metric                |
| chart-5      | 0.7 0.22 120      | Warm accent (alert)                  |

## Typography

- **Display**: Space Grotesk — futuristic, tech-forward headings and labels
- **Body**: DM Sans — clean, geometric, highly readable for UI text and explanations
- **Scale**: Hero `text-4xl font-bold tracking-tight`, Section `text-2xl font-bold`, Label `text-xs uppercase tracking-widest`, Body `text-sm` / `text-base`

## Elevation & Depth

Cards raised above background with subtle shadow (0 1px 4px). Chart visualization zone elevated further (0 4px 16px). No strong drop shadows — depth through background color separation and subtle grid texture.

## Structural Zones

| Zone            | Background          | Border                  | Notes                                    |
|-----------------|-------------------|------------------------|------------------------------------------|
| Header          | card (0.16)        | border / bottom        | Title + breadcrumb, minimal chrome       |
| Visualization   | background (0.12)  | subtle grid overlay    | 2D surface + convergence chart container |
| Control Panel   | card (0.16)        | border / left          | Sliders, inputs, metrics (right/bottom) |
| Status Bar      | secondary (0.22)   | border / top           | Real-time loss, iteration, gradient mag |
| Footer          | background (0.12)  | border / top           | Attribution, reset button                |

## Spacing & Rhythm

Grid-based spacing: 4px/8px/12px/16px/24px for micro rhythm. Sections separated by 24px–32px gaps. Controls grouped by function (learning rate, weights, actions) with 12px internal padding. Responsive: 16px padding mobile, 24px+ desktop.

## Component Patterns

- **Buttons**: Primary (periwinkle bg, dark text) on hover brightens L+0.05. Secondary (dark bg, border) invert on hover. Destructive (red) reserved for reset/divergence alerts.
- **Cards**: Subtle shadow, 1px border (border color), rounded-md (8px). No fill color — rely on elevation via shadow.
- **Sliders/Inputs**: Dark background (input 0.28), bright text, periwinkle ring on focus. Filled track in chart-1 (purple) or chart-2 (green).
- **Badges**: Small, rounded (rounded-full or rounded-lg), background chart color (1/2/3) with high chroma for visibility.
- **Charts**: Rendered via canvas/SVG with hardcoded chart colors (C/H preserved from tokens, L adjusted for contrast). Grid lines subtle (rgba 0.02 alpha).

## Motion

- **Entrance**: Slide-in from top (0.3s ease) for visualization zones, fade-in for controls (0.2s). No bounce.
- **Hover**: Smooth color transition (0.3s), shadow elevation for interactive elements. Border-radius and size unchanged.
- **Chart Updates**: Smooth line animation (0.4s) as loss updates. Pulse indicator (2s infinite) for active step.
- **Transitions**: Default `transition-smooth` (0.3s cubic-bezier).

## Constraints

- Chart colors must remain high-chroma for clarity on dark backgrounds; never desaturate (C ≥ 0.18).
- Grid overlay opacity capped at 2% to avoid visual noise during chart interaction.
- Header and footer remain fixed/sticky to maintain navigation context.
- No glassmorphism or backdrop blur — clarity prioritized for scientific visualizations.
- All interactive elements keyboard-accessible; focus rings always visible (ring 0.65 0.22 265).

## Signature Detail

Subtly animated grid-pattern background in visualization zone evokes both scientific rigor (gridded graph paper) and modern data aesthetics, reinforcing the ML/optimization context without distraction.
