import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Grid } from "@mui/material";
import ChartCard from "./ChartCard";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#9c27b0"];

function truncateLabel(value, max = 16) {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function cleanCategory(category = "") {
  if (!category) return "Unknown";
  return category.split("|")[0].split(">")[0].trim();
}

function formatChartData(data = [], key, maxItems = 8, formatter) {
  return data.slice(0, maxItems).map((item) => ({
    ...item,
    [key]: formatter ? formatter(item[key]) : item[key],
  }));
}

function AnalyticsCharts({
  productsPerCategory,
  topReviewedProducts,
  discountDistribution,
  categoryAvgRating,
}) {
  const categoryData = formatChartData(
    [...productsPerCategory].sort((a, b) => b.count - a.count),
    "category",
    8,
    cleanCategory,
  );

  const reviewedProductsData = formatChartData(
    [...topReviewedProducts].sort(
      (a, b) => Number(b.rating_count || 0) - Number(a.rating_count || 0),
    ),
    "product_name",
    8,
    (value) => truncateLabel(value, 18),
  );

  const ratingData = formatChartData(
    [...categoryAvgRating].sort(
      (a, b) => Number(b.average_rating || 0) - Number(a.average_rating || 0),
    ),
    "category",
    8,
    cleanCategory,
  );

  const discountData = discountDistribution.map((item) => ({
    ...item,
    range: item.range || item.discount_range || "Unknown",
  }));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <ChartCard title="Products per Category" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={70}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <ChartCard title="Top Reviewed Products" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reviewedProductsData}
              margin={{ top: 10, right: 10, left: 0, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="product_name"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="rating_count"
                fill={COLORS[1]}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <ChartCard title="Discount Distribution" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={discountData}
              margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS[2]} radius={[6, 6, 0, 0]}>
                {discountData.map((_, index) => (
                  <Cell key={index} fill={COLORS[2]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <ChartCard title="Category-wise Average Rating" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ratingData}
              margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={70}
                tick={{ fontSize: 11 }}
              />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="average_rating"
                fill={COLORS[3]}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
    </Grid>
  );
}

export default AnalyticsCharts;
