import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

function cleanCategory(category = "") {
  if (!category) return "Unknown";
  return category.split("|")[0].split(">")[0].trim();
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "-";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function formatDiscount(value) {
  if (value === null || value === undefined || value === "") return "-";
  const numeric = Number(value);
  const percentage = numeric <= 1 ? numeric * 100 : numeric;
  return `${percentage.toFixed(0)}%`;
}

function ProductTable({
  rows,
  total,
  page,
  rowsPerPage,
  loading,
  onPageChange,
  onRowsPerPageChange,
}) {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Product Name</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Discounted Price</strong>
              </TableCell>
              <TableCell>
                <strong>Actual Price</strong>
              </TableCell>
              <TableCell>
                <strong>Discount %</strong>
              </TableCell>
              <TableCell>
                <strong>Rating</strong>
              </TableCell>
              <TableCell>
                <strong>Rating Count</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box py={4}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((row, index) => (
                <TableRow key={row.id || index} hover>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Typography variant="body2">{row.product_name}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {cleanCategory(row.category)}
                  </TableCell>
                  <TableCell>{formatPrice(row.discounted_price)}</TableCell>
                  <TableCell>{formatPrice(row.actual_price)}</TableCell>
                  <TableCell>
                    {formatDiscount(row.discount_percentage)}
                  </TableCell>
                  <TableCell>{row.rating ?? "-"}</TableCell>
                  <TableCell>
                    {Number(row.rating_count || 0).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box py={4}>
                    <Typography color="text.secondary">
                      No products found.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
}

export default ProductTable;
