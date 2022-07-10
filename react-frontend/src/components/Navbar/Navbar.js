import "./navbar.css"
import React, { useState, useEffect } from "react"
import KakaoAuth from "../Kakao/Kakao"
import KakaoLogout from "../Kakao/KakaoLogout"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Settings from "@mui/icons-material/Settings"
import Logout from "@mui/icons-material/Logout"
import Searchbar from "../Searchbar/Searchbar"


export default function Navbar() {

  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(()=> {
    setToken(localStorage.getItem("token"))
  }, [token])

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const nickname = localStorage.getItem("nickname")

  return (
    <div className="navbar">
      <div style={{ width: 32, height: 32 }}></div>
      <Searchbar />
      <div className="login">
      {token ?
        <div>
          <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", height: "50px" }}>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>{nickname[0]}</Avatar>
              </IconButton>
            </Tooltip>     
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <Avatar /> {nickname} <b>님</b>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <KakaoLogout />
            </MenuItem>
          </Menu>
        </div>           
      : <KakaoAuth />
      }
      </div>
    </div>
  )
}