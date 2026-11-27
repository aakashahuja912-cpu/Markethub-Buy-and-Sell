# 🛍️ MarketHub
### Discover. Buy. Sell. Connect.

MarketHub is a modern, responsive, full-stack online marketplace inspired by platforms like OLX. It enables users to discover products and services, create listings, search by location, connect with sellers, and manage their marketplace activities through an intuitive interface.

Built with a clean black-and-white design, interactive animations, location-based discovery, and a responsive user experience, MarketHub aims to make buying and selling simple, accessible, and efficient.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login.
- Secure authentication.
- Logout functionality.
- Forgot-password and password-reset workflows.
- Protected user dashboard.

### 📦 Listing Management
- Create product and service listings.
- Upload and manage listing images.
- Edit and delete listings.
- Mark items as sold.
- Activate and deactivate listings.
- Renew expired listings.

### 🔍 Search & Discovery
- Search listings by keywords.
- Search by category and subcategory.
- Search by city, state, country, and area.
- Filter listings based on price.
- Sort by latest, oldest, price low-to-high and price high-to-low.
- Nearby listing discovery.

### 📍 Location-Based Marketplace
- Detect user's location through browser permission.
- Manually select location.
- Search listings by city and area.
- Location-based marketplace discovery.
- Map-based location selection.
- Location-aware search and filtering.

### 🗂️ Categories
Browse products and services through organized categories such as:

- Electronics
- Vehicles
- Property
- Furniture
- Fashion
- Books & Education
- Sports & Fitness
- Home Appliances
- Jobs
- Services
- Pets
- Other

### 👤 User Dashboard
- Manage personal listings.
- Track listing status.
- Edit account information.
- Manage favorites.
- View recently viewed listings.
- Renew expired listings.

### ❤️ Favorites
- Save listings.
- Remove saved listings.
- Access favorite products through the dashboard.

### 👁️ Recently Viewed
- Track recently viewed listings.
- Quickly revisit previously explored products.
- Support for guest users and authenticated users.

### 📞 Seller Contact
- Contact sellers through phone.
- WhatsApp contact integration.
- Seller profile information.

### 🚩 Listing Reports
Users can report listings for:
- Fraud or scams.
- Incorrect information.
- Duplicate listings.
- Inappropriate content.
- Prohibited items.
- Other issues.

### 🛡️ Admin Dashboard
- Manage registered users.
- Review listings.
- Approve or reject listings where moderation is enabled.
- Remove inappropriate listings.
- Manage categories and subcategories.
- Review user reports.
- Monitor marketplace statistics.

### 🌗 Theme System
- Black-and-white theme design.
- Light mode.
- Dark mode.
- Theme toggle.
- Theme preference persistence.
- System theme detection.

### ✨ Animations
- Smooth page transitions.
- Animated listing cards.
- Interactive hover effects.
- Animated navigation.
- Smooth modal transitions.
- Responsive mobile-menu animations.
- Reduced-motion accessibility support.

### 📱 Responsive Design
- Desktop-friendly layout.
- Tablet support.
- Mobile-friendly interface.
- Responsive listing cards.
- Mobile navigation.
- Optimized forms and search experience.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | UI development |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Lucide React | Icons |
| Framer Motion | Animations |
| Supabase | Backend and database |
| PostgreSQL | Database |
| Supabase Auth | Authentication |
| Supabase Storage | Image storage |
| React Hook Form | Form management |
| Zod | Validation |
| Leaflet | Interactive maps |
| OpenStreetMap | Map infrastructure |
| Nominatim | Geocoding and reverse geocoding |
| Vercel | Deployment |
| GitHub | Version control |

---

## 📂 Project Structure

```text
MarketHub/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── category/
│   │   ├── city/
│   │   ├── listing/
│   │   └── api/
│   ├── components/
│   │   ├── layout/
│   │   ├── listings/
│   │   ├── search/
│   │   ├── forms/
│   │   ├── ui/
│   │   └── admin/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── validations/
│   │   └── utils/
│   ├── hooks/
│   ├── types/
│   └── styles/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
├── package.json
├── README.md
└── tsconfig.json
```

*The structure above represents the intended organization; the actual repository may vary depending on implementation.*

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/MarketHub.git
```

### 2. Navigate to the project directory

```bash
cd MarketHub
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Use the credentials from your Supabase project.

Never commit real credentials or secrets to GitHub.

### 5. Configure Supabase

- Create a Supabase project.
- Configure PostgreSQL tables.
- Enable authentication.
- Configure storage buckets.
- Apply database migrations.
- Configure Row Level Security (RLS).
- Configure appropriate policies.

### 6. Run the development server

```bash
npm run dev
```

### 7. Open the application

Navigate to:

```text
http://localhost:3000
```

---

## 🗄️ Database Overview

The application may include the following database tables:

| Table | Description |
|---|---|
| profiles | User profile information |
| listings | Marketplace listings |
| categories | Main listing categories |
| subcategories | Category subdivisions |
| favorites | Saved listings |
| reports | Reported listings |
| recently_viewed | Listing viewing history |

### Listing Data

A listing may contain:

- Listing ID
- Title
- Description
- Price
- Category
- Subcategory
- Listing type
- Condition
- Country
- State
- City
- Area
- Images
- Seller ID
- Listing status
- Created date
- Expiration date

---

## 🌐 Application Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/login` | User login |
| `/register` | User registration |
| `/dashboard` | User dashboard |
| `/dashboard/listings` | Manage listings |
| `/dashboard/favorites` | Saved listings |
| `/dashboard/profile` | User profile |
| `/category/[category]` | Category listings |
| `/city/[city]` | City listings |
| `/city/[city]/[category]` | City-specific category listings |
| `/listing/[slug]` | Listing details |
| `/admin` | Admin dashboard |

---

## 🔒 Security

MarketHub is designed with security-focused practices:

- Authentication-based access control.
- Protected routes.
- Supabase Row Level Security.
- Secure database access.
- Input validation.
- Form validation.
- Image upload validation.
- Role-based administrative access.
- Protection against unauthorized listing modification.
- Environment-variable-based configuration.

---

## 🎨 Design Philosophy

MarketHub follows a modern monochrome design philosophy.

- Minimalist black-and-white interface.
- Clean typography.
- Modern layouts.
- Smooth animations.
- Accessible contrast.
- Interactive components.
- Consistent spacing.
- Mobile-first responsiveness.

The interface is designed to prioritize product discovery, ease of navigation, and simplicity.

---

## 📈 Future Enhancements

Potential future improvements include:

- Real-time messaging between buyers and sellers.
- AI-powered listing recommendations.
- AI-based product description generation.
- Advanced location-based recommendations.
- Seller verification.
- Premium listings.
- Notification system.
- Real-time marketplace updates.
- Advanced fraud detection.



**Project Name:** MarketHub

**Tagline:** Discover. Buy. Sell. Connect.

**Development Focus:** Full-stack web development, marketplace functionality, location-based search, responsive UI, and user experience.

---

## 📜 License

This project is intended for educational, development, and portfolio purposes.

A license can be added to the repository to define permissions for reuse, distribution, and modification.

---

⭐ If you find this project interesting, consider starring the repository!
