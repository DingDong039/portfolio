# Portfolio Website - Watchara Tongyodpun

Modern portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern and responsive design
- 🌓 Dark mode support
- 📱 Mobile-friendly
- 📧 Contact form with email functionality
- 🐳 Docker support
- ☁️ Vercel deployment ready

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Email:** Resend
- **Icons:** Lucide React
- **Deployment:** Vercel / Docker

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your Resend API key to `.env`:
```
RESEND_API_KEY=your_api_key_here
```

5. Add your profile image:
- Place your profile image in `/public/profile.jpg`
- Add your Line QR code image in `/public`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build

Build for production:

```bash
npm run build
npm start
```

## Docker Deployment

### Build Docker image:

```bash
docker build -t portfolio .
```

### Run with Docker:

```bash
docker run -p 3000:3000 -e RESEND_API_KEY=your_api_key portfolio
```

### Or use Docker Compose:

```bash
# Create .env file with RESEND_API_KEY
docker-compose up -d
```

## Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variable:
   - `RESEND_API_KEY`: Your Resend API key
4. Deploy

### Or use Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from [API Keys](https://resend.com/api-keys)
3. Add the API key to your `.env` file
4. Update the email in `/app/api/contact/route.ts` to your email

## Customization

### Update Personal Information

Edit the following files to customize with your information:

- `/components/Hero.tsx` - Name, title, tagline
- `/components/About.tsx` - About section, education, certifications
- `/components/Projects.tsx` - Work experience and projects
- `/components/Skills.tsx` - Skills and technologies
- `/components/Contact.tsx` - Contact information
- `/app/api/contact/route.ts` - Email recipient

### Update Social Links

Update social media links in:
- `/components/Hero.tsx`
- `/components/Contact.tsx`

## Project Structure

```
portfolio/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts       # Email API endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── Hero.tsx               # Hero section
│   ├── About.tsx              # About section
│   ├── Projects.tsx           # Projects/Experience section
│   ├── Skills.tsx             # Skills section
│   └── Contact.tsx            # Contact section
├── public/                    # Static files
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose configuration
├── vercel.json               # Vercel configuration
└── next.config.ts            # Next.js configuration
```

## License

MIT

## Author

Watchara Tongyodpun
- Email: watchara.ddev@gmail.com
- Location: Bangkok, Thailand
