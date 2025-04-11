# Nutrition AI Assistant

A personalized nutrition assistant powered by AI that helps users make informed dietary choices and create meal plans based on their preferences and health goals.

## Features

- **AI-Powered Chat**: Engage in natural conversations about nutrition and meal planning
- **Authentication**: Supabase Authentication
- **Database**: Supabase PostgreSQL
- **Real-time Updates**: Supabase Realtime
- **Modern UI**: Built with shadcn/ui components

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- OpenAI

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [OpenAI](https://openai.com/) for the GPT-4 API
- [Supabase](https://supabase.com/) for the backend infrastructure

## Contact

Your Name - [@saketkmr](https://twitter.com/saketkmr)

Project Link: [https://github.com/saki007ster/nutrition-assistant](https://github.com/saki007ster/nutrition-assistant)

## Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the following environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `OPENAI_API_KEY`: Your OpenAI API key

**Important**: Never commit `.env.local` or any other files containing actual API keys to version control.
