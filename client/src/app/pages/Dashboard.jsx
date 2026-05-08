import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import FileUpload from "../components/FileUpload";
import SummaryCard from "../components/SummaryCard";
import AnalyticsCharts from "../components/AnalyticsCharts";
import ProductTable from "../components/ProductTable";
import { fetchProducts } from "../features/products/productSlice.js";
import { fetchAnalytics } from "../features/analytics/analyticsSlice.js";

function cleanCategory(category = "") {
  if (!category) return "Unknown";
  return category.split("|")[0].split(">")[0].trim();
}

function Dashboard() {
  const dispatch = useDispatch();

  const { items, total, loading, error } = useSelector(
    (state) => state.products,
  );

  const {
    productsPerCategory,
    topReviewedProducts,
    discountDistribution,
    categoryAvgRating,
    loading: analyticsLoading,
    error: analyticsError,
  } = useSelector((state) => state.analytics);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(
      fetchProducts({
        search,
        category,
        rating,
        page: currentPage,
        limit: rowsPerPage,
      }),
    );
  }, [dispatch, search, category, rating, currentPage, rowsPerPage]);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const categoryOptions = useMemo(() => {
    return [
      ...new Set(
        productsPerCategory.map((item) => item.category).filter(Boolean),
      ),
    ];
  }, [productsPerCategory]);

  const summary = useMemo(() => {
    const totalCategories = productsPerCategory.length;
    const totalReviews = topReviewedProducts.reduce(
      (sum, item) => sum + Number(item.rating_count || 0),
      0,
    );
    const avgRating =
      categoryAvgRating.length > 0
        ? (
            categoryAvgRating.reduce(
              (sum, item) => sum + Number(item.average_rating || 0),
              0,
            ) / categoryAvgRating.length
          ).toFixed(2)
        : "0.00";

    return {
      totalProducts: total,
      totalCategories,
      avgRating,
      totalReviews,
    };
  }, [productsPerCategory, categoryAvgRating, topReviewedProducts, total]);

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setRating("");
    setCurrentPage(1);
    setRowsPerPage(10);
  };

  const reloadAll = () => {
    dispatch(
      fetchProducts({
        search,
        category,
        rating,
        page: currentPage,
        limit: rowsPerPage,
      }),
    );
    dispatch(fetchAnalytics());
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Product Ratings & Review Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Analyze products, categories, discounts, ratings, and review
              engagement.
            </Typography>
          </Box>

          <FileUpload onUploadSuccess={reloadAll} />
        </Stack>
      </Paper>

      {(error || analyticsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || analyticsError}
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Total Products" value={summary.totalProducts} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Categories"
            value={summary.totalCategories}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Average Rating" value={summary.avgRating} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Total Reviews" value={summary.totalReviews} />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search by Product Name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {categoryOptions.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cleanCategory(cat)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Rating Band"
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1-2">1 to 2</MenuItem>
              <MenuItem value="2-3">2 to 3</MenuItem>
              <MenuItem value="3-4">3 to 4</MenuItem>
              <MenuItem value="4-5">4 to 5</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ height: "56px" }}
              onClick={handleReset}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box mb={4}>
        <AnalyticsCharts
          productsPerCategory={productsPerCategory}
          topReviewedProducts={topReviewedProducts}
          discountDistribution={discountDistribution}
          categoryAvgRating={categoryAvgRating}
        />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom fontWeight={700}>
          Product Data
        </Typography>
        <ProductTable
          rows={items}
          total={total}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          loading={loading || analyticsLoading}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </Box>
    </Container>
  );
}

export default Dashboard;
