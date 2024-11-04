import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import axios from "axios";

const paginationModel = { page: 0, pageSize: 10 };

const columns = [
  { field: "coin", headerName: "Coin 💰", width: 100 },
  { field: "code", headerName: "Code 📝", width: 100 },
  { field: "price", headerName: "Price 🤑", width: 100 },
  {
    field: "totalSupply",
    headerName: "Total Supply 📈",
    type: "number",
    width: 150,
  },
];

export default function Table() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coinlore.net/api/tickers/"
        );
        const data = response.data.data
          .map((item, index) => ({
            id: index + 1,
            coin: item.name || "",
            code: item.symbol || "",
            price: item.price_usd
              ? `$${parseFloat(item.price_usd).toLocaleString()}`
              : "", // Format price
            totalSupply: item.tsupply
              ? parseInt(item.tsupply).toLocaleString()
              : "",
          }))
          .filter(
            (item) => item.coin && item.code && item.price && item.totalSupply
          );

        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "500px",
        }}
      >
        <Typography variant="h4">Coin Table</Typography>
        <Paper
          sx={{
            width: "100%",
            mt: 2,
            overflow: "hidden",
            fontSize: "0.8rem",
            "@media (max-width: 600px)": {
              width: "100%",
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            disableSelectionOnClick
            loading={loading}
            autoHeight
            sx={{
              border: 0,
              "& .MuiDataGrid-cell": {
                whiteSpace: "normal",
                wordBreak: "break-word",
                lineHeight: "1.25",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflow: "hidden !important",
              },
              "@media (max-width: 600px)": {
                "& .MuiDataGrid-columnHeaders": { fontSize: "0.8rem" },
                "& .MuiDataGrid-cell": { fontSize: "0.8rem" },
              },
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}
