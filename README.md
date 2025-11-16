# Safe Travel — Listing App (Node.js + Express + EJS)

**Simple Airbnb-style listing app** built with Node.js, Express, EJS, MongoDB and MapTiler.  
This repo contains listing creation, edit, delete, category filtering, reviews, image upload, and map integration.

---

## Features

- Create / Read / Update / Delete listings
- Category-based filtering and search
- Geocoding via MapTiler (convert location → coordinates)
- Map display (Leaflet + MapTiler tiles)
- Image upload (Cloudinary / local storage)
- Reviews with owner-only deletion
- Joi validation and authentication middleware
- Seed script support for demo data

---

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)
- MapTiler API Key
- (Optional) Cloudinary account for image uploads

---

## Quick Start — Local (Development)

1. Clone the repo (or create new folder and add files)

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
