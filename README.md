# Cognivex Hotel PMS — Frontend Application

Modern, high-performance, bilingual (English & Arabic RTL) frontend for **Cognivex Hotel PMS**, built according to the **Cognivex Hotel PMS Frontend-Only Development Blueprint** and PRD v1.0 specifications.

---

## 🚀 Quick Start

1. Open a terminal in this directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at `http://localhost:3000`

---

## 🏛️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript (Strict Mode) |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS v4 + Radix UI Primitives |
| **Routing** | React Router v7 (`createBrowserRouter`) |
| **Data Fetching** | TanStack Query v5 + Frontend API Client Abstraction |
| **Tables & Grids** | TanStack Table v8 (Sorting, Filtering, Pagination) |
| **Analytics & Charts**| Recharts (AreaCharts, Donut Charts) |
| **Internationalization**| i18next + react-i18next (English & Arabic with real-time RTL `dir="rtl"`) |
| **Icons** | Lucide React |

---

## 📦 The 14 Modules Implemented

1. **Dashboard (`/`)**
   - Live KPI cards: Occupancy %, ADR (Average Daily Rate), RevPAR, Today's Gross Revenue (QAR).
   - 7-Day Revenue Trend (Room vs F&B vs Services) with AreaCharts.
   - Channel Mix Donut Chart (Direct Website, OTA, Corporate, Walk-In).
   - Turnaround Queue & Operational alerts.
2. **Front Desk (`/front-desk`)**
   - 60-Second Rapid Check-in Guided Wizard (Guest Verification ➔ Clean Room Assignment ➔ QNB Payment Guarantee ➔ E-Signature ➔ Key Encoding & MOI Reporting).
   - Expected Arrivals, In-House, and Due-Out Departures tabs.
   - Quick Walk-in and Room Move flows.
3. **Rooms & Room Rack (`/rooms`)**
   - Interactive Floor & Status Grid (Floors 1–4, Standard, Deluxe, Suite, Presidential).
   - Color-coded states: *Available, Occupied, Dirty, Cleaning, Inspected, Maintenance, Out of Order (OOO)*.
   - Instant Room Detail drawer with status override controls.
4. **Reservations (`/reservations`)**
   - Searchable booking catalog with OTA source tags (Booking.com, Expedia, Direct).
   - New Reservation Creation modal with dynamic nights and room rate calculations.
5. **Folio & Cashiering (`/billing`)**
   - 4-Window Split-Folio Billing Canvas (Guest Personal, Corporate City Ledger, Incidentals/Minibar, Disputed).
   - Immutable accounting ledger with mandatory audit reason prompts for Voids/Adjustments.
   - Bilingual Qatar General Tax Authority (GTA) E-Invoice modal with QR code payload and gapless numbering.
6. **Housekeeping (`/housekeeping`)**
   - Supervisor inspection and room release workflow.
   - Toggleable **Mobile Attendant PWA View** with touch-first (48px) start/complete clean buttons.
7. **Maintenance & Engineering (`/maintenance`)**
   - Work order logging with category (AC/HVAC, Plumbing, Electrical, Wi-Fi) and priority SLA.
   - Resolution workflow and room blocking.
8. **Restaurant POS (`/restaurant`)**
   - Point-of-Sale interface with category tabs (Breakfast, Dinner, Room Service, Drinks).
   - Order basket calculation (5% municipality tax + 7% service charge).
   - Instant "Post to Room Folio" button.
9. **Staff Directory (`/employees`)**
   - Employee roster with designations, departments, and shifts.
10. **Staff Attendance (`/attendance`)**
    - Daily clock-in/out records, working hours calculation, and Qatar WPS alignment.
11. **Inventory & Stores (`/inventory`)**
    - Housekeeping linen, amenities, and F&B stock levels with low-stock alerts.
12. **BI Reports (`/reports`)**
    - USALI 11th edition departmental income statement preview.
    - Export action placeholders for Excel and PDF.
13. **Guest Profiles & Privacy Vault (`/guests`)**
    - Qatar Personal Data Privacy Protection Law (PDPPL No. 13/2016) compliant profile vault.
    - Role-based masked identification view for Passports and Qatar IDs.
14. **Night Audit Rollover (`/night-audit`)**
    - Pre-flight automated checklist (unassigned arrivals, open cashier shifts, POS tickets).
    - Multi-step audit pipeline advancing hotel business date to the next accounting day.
15. **System Settings (`/settings`)**
    - Property profile (EN/AR), Qatar TIN configuration, and tax engine parameters.

---

## ⌨️ Fast Navigation & Productivity

- Press **`Ctrl+K`** (or `Cmd+K` on Mac) anywhere to open the **Global Command Palette** and jump directly to any screen or workflow.
- Toggle between **English** and **العربية (RTL)** with one click on the globe icon in the top navigation bar.
- Toggle between **Light Mode** and **Dark Mode** with the theme switch.
