import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Button from "@mui/material/Button";

import ReplayIcon from "@mui/icons-material/Replay";

export const NavBar = ({
  walletAddress,
  isLoading,
  handleDisconnectToWallet,
  handleConnectToWallet,
  getAllData,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            // border: "2px solid red",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{ fontSize: "30px", color: "#e783f7" }}
          >
            𝓜𝓾𝓵𝓽𝓲 𝓢𝓲𝓰𝓷𝓮𝓻 𝓦𝓪𝓵𝓵𝓮𝓽
          </Typography>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <Button
                variant="contained"
                size="large"
                disabled={walletAddress === ""}
                onClick={getAllData}
                color="secondary"
                startIcon={<ReplayIcon />}
              >
                Refresh
              </Button>
            </IconButton>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() =>
                  walletAddress === ""
                    ? handleConnectToWallet()
                    : handleDisconnectToWallet()
                }
              >
                {walletAddress !== "" ? "LogOut" : "Login"}
              </Button>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
