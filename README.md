# UV Homez - Premium Interior & Construction Website

![UV Homez Hero](https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000)

Welcome to the official repository for **UV Homez**, a premium interior design and construction business based in Hyderabad. The website is designed to be highly performant, visually stunning, and easily maintainable.

## 🚀 Features

- **Blazing Fast Performance:** Built with lightweight Vanilla JavaScript and optimized CSS.
- **Data-Driven Architecture:** All core content (Services, Portfolio Projects, Testimonials) is dynamically rendered from a centralized `public/data.json` file. This means you can update the website content without touching any HTML/JS code!
- **Interactive UI/UX:** 
  - Smooth Ken Burns hero animation
  - Subtle scroll animations via Intersection Observer
  - Premium glassmorphism effects and gradient text
  - Animated pulse effect on primary Call-to-Action (WhatsApp/Contact) buttons
- **Dynamic Portfolio Filtering:** Instantly filter projects by category (Kitchen, Living Room, Bedroom, etc.).
- **Google Sheets Integration (Ready):** The contact form logic is pre-configured to send lead data directly to a private Google Sheet via Google Apps Script without page reloads.
- **SEO Optimized:** Fully loaded with meta tags, Open Graph (Facebook/Instagram), Twitter cards, and Schema.org Local Business markup.

## 🛠️ Technology Stack

- **Frontend:** HTML5, Vanilla CSS3, Vanilla JavaScript
- **Build Tool / Bundler:** [Vite](https://vitejs.dev/)
- **Icons:** FontAwesome 6
- **Fonts:** Google Fonts (Inter & Playfair Display)

## 💻 Local Development

To run this project locally on your machine, you need [Node.js](https://nodejs.org/) installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srinivas3006/uv-homez-website.git
   cd uv-homez-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
├── public/
│   ├── data.json           # All dynamic content (Services, Projects, Testimonials)
│   ├── logo.png            # Brand logo
│   └── favicon.svg         # Site favicon
├── src/
│   ├── main.js             # Core logic, rendering, scroll animations, form handling
│   └── style.css           # All styling, variables, animations, and media queries
├── index.html              # Main HTML structure
├── package.json            # Project configuration and dependencies
├── vercel.json             # Vercel deployment and routing configuration
└── api/                    # Vercel Serverless Functions for Admin Panel
    ├── save-project.js
    └── save-testimonial.js
```

## 📝 Updating Content (No Code Required)

To update the services, add new projects to the portfolio, or add new client reviews, simply open the `public/data.json` file. 

For example, to add a new project, append an object to the `projects` array:
```json
{
  "id": 7,
  "category": "Kitchen",
  "title": "Modern Classic Kitchen",
  "image": "https://link-to-your-image.jpg"
}
```
The website will automatically detect the new category, add a filter button for it, and display the new project!

## 🚀 Deployment

This project is optimized for deployment on **Vercel**. 

1. Push your code to a GitHub repository.
2. Import the repository into Vercel.
3. Add the following Environment Variables in Vercel:
   - `ADMIN_PASSWORD`: Your secret password for the `/admin` dashboard.
   - `GITHUB_TOKEN`: A GitHub Personal Access Token to allow the serverless functions to update the repository.
4. Vercel will automatically build and deploy your site on every push to the `main` branch.

## 📄 License

&copy; 2026 UV Homez Interior Studio & Construction. All rights reserved.
