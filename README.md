# Blackhood — E-Commerce Site

A full-stack e-commerce web application built with Next.js, featuring user authentication, payment integration, and email notifications.

🔗 **Live Demo:** [blackhood-liart.vercel.app](https://blackhood-liart.vercel.app)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui (Radix UI)
- **Database:** PostgreSQL (`pg`)
- **Auth:** JWT + bcrypt
- **Payments:** Razorpay
- **Email:** Nodemailer
- **Icons:** Lucide React, React Icons
- **Notifications:** React Hot Toast

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
git clone https://github.com/Isha-Chaudhary48/Blackhood-ecommerce-site.git
cd Blackhood-ecommerce-site
npm install
```

### Environment Variables

Create a `.env.local` file in the root and add:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

This project is deployed on **Vercel**. Push to the `main` branch to trigger an automatic deployment.

Make sure all environment variables are configured in your Vercel project settings.

