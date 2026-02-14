# HappyInvoice

**Live Link: https://happyinvoice.vercel.app/**

**The Centralized Solution: Managing the entire client project lifecycle in a single, smart SaaS platform.**

HappyInvoice transforms the often-dreaded process of invoicing and project management into an effortless, smart, and beautifully designed experience for the modern small business and freelance professional.

## 🚀 The Problem

Freelancers and small businesses struggle with disjointed workflows:
*   **Scattered Communication**: Client requirements buried in WhatsApp or email threads.
*   **Missed Deadlines & Payments**: Lack of automated tracking leads to slipping timelines and forgotten invoices.
*   **Error-Prone Invoicing**: Manual Excel/PDF creation is time-consuming and risks calculation errors.

## ✨ The Solution: HappyInvoice

HappyInvoice unifies these fragmented processes into one simple platform where every facet of the client relationship—project work, communication, and financial transactions—happens smoothly and transparently.

### Core Features

*   **📄 Invoice & Quote Generation**
    *   Instant, professional document creation with custom branding.
    *   Supports multi-currency and automated tax calculations.
    *   Ready to send in minutes.

*   **📝 Proposal Builder**
    *   Structured builder to detail project scope and set milestones.
    *   Present transparent pricing for quicker client approvals.

*   **📊 Project Dashboard**
    *   The central hub for all project components: invoices, active tasks, timeline progress, associated files, and recent updates.

*   **💬 Threaded Chat & Sharing**
    *   Dedicated communication channels within each project.
    *   Ensures discussions and shared files remain contextual and easily searchable.

*   **👥 Role-Based Access (Client View)**
    *   Separate, clean interfaces for the client and the freelancer.
    *   Clients only see relevant information (e.g., invoices, progress) without internal task clutter.

*   **🔔 Automated Notifications**
    *   System-wide alerts for pending payments, task deadlines, milestone approvals, and file updates.
    *   Drastically reduces the chance of missed actions.

## 🛠️ Tech Stack

This project is built with a modern, robust tech stack:

*   **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth, App Hosting)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
*   **Email Service**: [Resend](https://resend.com/)
*   **Signature**: react-signature-canvas

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/isyedsamad/happyinvoice.git
    cd happyinvoice
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Firebase and Resend configuration keys.
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    # ... other firebase config
    RESEND_API_KEY=your_resend_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is created for educational purposes as a college project. All rights reserved.

---
*Built with ❤️ by Syed Samad*
