Live demo: [product-review-dashboard](https://product-review-dashboard-phi.vercel.app/)

# Product Ratings & Review Analytics Dashboard

A full-stack dashboard that imports product and review data from Excel/CSV, stores it in PostgreSQL, and presents searchable, filterable analytics through tables and charts. The application uses a Node.js + Express backend, PostgreSQL with Sequelize, and a React + MUI frontend with Redux Toolkit for state management.

## Features

### Backend

- RESTful APIs built with Express for import, products listing, and analytics.
- PostgreSQL integration using Sequelize.
- File upload support using Multer for CSV, XLS, and XLSX files.
- Data import logic for products and reviews from spreadsheet data.
- Search, category filter, rating filter, pagination, and analytics endpoints for dashboard consumption.

### Frontend

- React dashboard UI with MUI components and theme setup.
- Redux Toolkit store with slices for products and analytics.
- Upload interface for Excel/CSV import with client-side validation and snackbar feedback.
- Product data table with pagination.
- Analytics chart section for category count, top reviewed products, discount distribution, and category-wise average rating.
- Filters for category and rating, plus search by product name.

## Tech Stack

| Layer    | Technology                                 |
| -------- | ------------------------------------------ |
| Frontend | React, MUI, Redux Toolkit, Axios, Recharts |
| Backend  | Node.js, Express, Multer, XLSX             |
| Database | PostgreSQL, Sequelize [1][16][17][18]      |

## Project Structure

```bash
project-root/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── importController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── fileUpload.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Review.js
│   │   └── index.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── importRoutes.js
│   │   └── productRoutes.js
│   ├── app.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── components/
│   │   │   ├── AnalyticsCharts.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── ProductTable.jsx
│   │   │   └── SummaryCard.jsx
│   │   ├── features/
│   │   │   ├── analytics/
│   │   │   │   └── analyticsSlice.js
│   │   │   └── products/
│   │   │       └── productSlice.js
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── .env
└── README.md
```

## Dataset

The reference dataset contains product and review-oriented fields such as `productid`, `productname`, `category`, `discountedprice`, `actualprice`, `discountpercentage`, `rating`, `ratingcount`, `aboutproduct`, `username`, `reviewtitle`, and `reviewcontent`. These fields support the required dashboard analytics for product performance, discount distribution, customer feedback, and review engagement.

## API Endpoints

### Import

#### `POST /api/import`

Uploads a CSV/XLS/XLSX file and imports product and review data into PostgreSQL.

### Products

#### `GET /api/products`

Returns paginated product data with optional search and filters. Supported query params include:

- `search`
- `category`
- `rating`
- `page`
- `limit`

Example:

```http
GET /api/products?search=boat&category=Electronics&rating=4-5&page=1&limit=10
```

### Analytics

- `GET /api/analytics/products-per-category`
- `GET /api/analytics/top-reviewed-products`
- `GET /api/analytics/discount-distribution`
- `GET /api/analytics/category-average-rating`

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-github-repo-link>
cd <project-folder>
```

### 2. Setup the backend

Create the backend folder structure and place the backend files accordingly. The backend uses PostgreSQL and Sequelize for persistence.

#### Install dependencies

```bash
cd backend
npm install express cors dotenv multer xlsx sequelize pg pg-hstore
```

#### Create `.env`

```env
PORT=5000
DB_NAME=product_dashboard
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

#### Start backend

```bash
npm run dev
```

or

```bash
node server.js
```

The backend runs on `http://localhost:5000`.

### 3. Setup PostgreSQL

Create a PostgreSQL database with the name used in your `.env` file, for example `product_dashboard`. Sequelize will connect using the credentials from `db.js`, and the models are defined in `Product.js` and `Review.js`.

### 4. Setup the frontend

Place the frontend files into the React project structure shown above so the imports resolve correctly. The frontend uses Redux Toolkit, Axios, MUI, and Recharts.

#### Create a Vite app if needed

```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
```

#### Install dependencies

```bash
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @reduxjs/toolkit react-redux axios recharts
```

#### Create frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Start frontend

```bash
npm run dev
```

The frontend typically runs on `http://localhost:5173` when using Vite.

## How to Run the Project

1. Start PostgreSQL.
2. Start the backend server.
3. Start the frontend server.
4. Open the frontend in the browser.
5. Upload the provided Excel/CSV dataset.
6. View dashboard metrics, charts, table data, and apply filters/search.

## Expected Dashboard Functionality

After importing the dataset, the dashboard should support:

- File upload for Excel/CSV.
- Product table with pagination.
- Search by product name.
- Filters by category and rating.
- Products per category chart.
- Top reviewed products chart.
- Discount distribution chart.
- Category-wise average rating chart.

## Important Notes

- The provided sample file is product/review data rather than transaction-style sales data, so the dashboard is designed around product analytics, rating trends, discount insights, and review engagement.
- Before final submission, it is recommended to remove destructive database sync behavior such as `sequelize.sync({ force: true })` and replace it with safer sync logic so imported data is not lost on server restart.
- The import controller should support both snake_case and compact dataset headers for smoother uploads with real files.
