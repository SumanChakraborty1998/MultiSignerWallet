import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ProgressBar } from "./ProgressBar";

export const Body = ({ isEntaracting, owners }) => {
  return isEntaracting ? (
    <List
      sx={{
        width: "100%",
        // border: "10px solid black",
        // maxWidth: 360,
        // bgcolor: "background.paper",
        marginLeft: "39%",
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <AccountCircleIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Owner1" secondary={owners[0]} />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <AccountCircleIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Owner2" secondary={owners[1]} />
      </ListItem>
    </List>
  ) : (
    <ProgressBar />
  );
};
