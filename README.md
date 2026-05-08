# Product Ratings & Review Analytics Dashboard

A full-stack dashboard that imports product and review data from Excel/CSV, stores it in PostgreSQL, and presents searchable, filterable analytics through tables and charts. The application uses a Node.js + Express backend, PostgreSQL with Sequelize, and a React + MUI frontend with Redux Toolkit for state management. [1][2][3][4][5][6][7][8][9][10]

## Features

### Backend

- RESTful APIs built with Express for import, products listing, and analytics. [2][3][4][11][12][13][14][15]
- PostgreSQL integration using Sequelize. [1][16][17][18]
- File upload support using Multer for CSV, XLS, and XLSX files. [19][12]
- Data import logic for products and reviews from spreadsheet data. [4]
- Search, category filter, rating filter, pagination, and analytics endpoints for dashboard consumption. [2][3]

### Frontend

- React dashboard UI with MUI components and theme setup. [6][9]
- Redux Toolkit store with slices for products and analytics. [7][8][10]
- Upload interface for Excel/CSV import with client-side validation and snackbar feedback. [20]
- Product data table with pagination. [21]
- Analytics chart section for category count, top reviewed products, discount distribution, and category-wise average rating. [22][7][9]
- Filters for category and rating, plus search by product name. [8][9]

## Tech Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | React, MUI, Redux Toolkit, Axios, Recharts [6][22][7][8][23][10] |
| Backend  | Node.js, Express, Multer, XLSX [4][19][14][15]                   |
| Database | PostgreSQL, Sequelize [1][16][17][18]                            |

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

The reference dataset contains product and review-oriented fields such as `productid`, `productname`, `category`, `discountedprice`, `actualprice`, `discountpercentage`, `rating`, `ratingcount`, `aboutproduct`, `username`, `reviewtitle`, and `reviewcontent`. These fields support the required dashboard analytics for product performance, discount distribution, customer feedback, and review engagement. [24]

## API Endpoints

### Import

#### `POST /api/import`

Uploads a CSV/XLS/XLSX file and imports product and review data into PostgreSQL. [4][12]

### Products

#### `GET /api/products`

Returns paginated product data with optional search and filters. Supported query params include:

- `search`
- `category`
- `rating`
- `page`
- `limit` [3][13]

Example:

```http
GET /api/products?search=boat&category=Electronics&rating=4-5&page=1&limit=10
```

### Analytics

- `GET /api/analytics/products-per-category` [2][11]
- `GET /api/analytics/top-reviewed-products` [2][11]
- `GET /api/analytics/discount-distribution` [2][11]
- `GET /api/analytics/category-average-rating` [2][11]

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-github-repo-link>
cd <project-folder>
```

### 2. Setup the backend

Create the backend folder structure and place the backend files accordingly. The backend uses PostgreSQL and Sequelize for persistence. [1][16][14][15]

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

The backend runs on `http://localhost:5000`. [15]

### 3. Setup PostgreSQL

Create a PostgreSQL database with the name used in your `.env` file, for example `product_dashboard`. Sequelize will connect using the credentials from `db.js`, and the models are defined in `Product.js` and `Review.js`. [1][17][18]

### 4. Setup the frontend

Place the frontend files into the React project structure shown above so the imports resolve correctly. The frontend uses Redux Toolkit, Axios, MUI, and Recharts. [6][22][7][8][23][10]

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

The frontend typically runs on `http://localhost:5173` when using Vite. [6][23]

## How to Run the Project

1. Start PostgreSQL.
2. Start the backend server.
3. Start the frontend server.
4. Open the frontend in the browser.
5. Upload the provided Excel/CSV dataset.
6. View dashboard metrics, charts, table data, and apply filters/search. [24][4][20][21][9]

## Expected Dashboard Functionality

After importing the dataset, the dashboard should support:

- File upload for Excel/CSV. [20]
- Product table with pagination. [21]
- Search by product name. [8][9]
- Filters by category and rating. [8][9]
- Products per category chart. [2][22][7]
- Top reviewed products chart. [2][22][7]
- Discount distribution chart. [2][22][7]
- Category-wise average rating chart. [2][22][7]

## Important Notes

- The provided sample file is product/review data rather than transaction-style sales data, so the dashboard is designed around product analytics, rating trends, discount insights, and review engagement. [24]
- Before final submission, it is recommended to remove destructive database sync behavior such as `sequelize.sync({ force: true })` and replace it with safer sync logic so imported data is not lost on server restart. [16]
- The import controller should support both snake_case and compact dataset headers for smoother uploads with real files. [24][4]
