# Agent Guidelines for ShowMeTheMarket

## Build/Lint/Test Commands

- `bun run dev`: Start development server
- `bun run build`: Build the application
- `bun run check`: Run type checking
- `bun run format`: Format code with Prettier
- `bun run lint`: Check formatting with Prettier
- `bun run tauri`: Run Tauri commands

## Code Style Guidelines

- **Formatting**: Use tabs, single quotes, no trailing commas, 100 char line limit
- **Imports**: Group by source ($lib first, then external), alphabetically within groups
- **Types**: Use Zod schemas with z.infer<> for type definitions
- **Naming**: PascalCase for functions/components, camelCase for variables/props
- **Error Handling**: Throw descriptive errors, use try/catch with specific error types
- **TypeScript**: Strict mode enabled, avoid using any
- **Validation**: Use Zod for data validation with descriptive error messages
- **Components**: Svelte 5 syntax with rune support
- **CSS**: Tailwind with DaisyUI components
- **Backend**: Rust with Tauri for cross-platform functionality
