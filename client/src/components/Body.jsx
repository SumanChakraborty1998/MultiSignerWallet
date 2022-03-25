import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// import ImageIcon from "@mui/icons-material/Image";
// import WorkIcon from "@mui/icons-material/Work";
// import BeachAccessIcon from "@mui/icons-material/BeachAccess";
// import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ProgressBar } from "./ProgressBar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#9C27B0",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const Body = ({
  isEntaracting,
  owners,
  getAllData,
  createTransaction,
  transactions,
  isAOwner,
  handleApproveTransaction,
}) => {
  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const handleReset = () => {
    setRecipient("");
    setAmount("");
  };

  const handleCreateTransaction = () => {
    if (recipient === "") {
      alert("Please enter a recipient");
      return;
    }
    if (amount === "") {
      alert("Please enter an amount");
      return;
    }
    createTransaction(recipient.trim(), Number(amount));
    handleReset();
  };

  return !isEntaracting ? (
    <div>
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
      <br />
      <div>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            value={recipient}
            label="Recipient"
            variant="outlined"
            onChange={(e) => setRecipient(e.target.value)}
          />
          <TextField
            value={amount}
            label="Amount in Wei"
            variant="outlined"
            type="number"
            onChange={(e) => setAmount(e.target.value)}
          />
        </Box>

        <br />
        <br />

        <Button
          variant="contained"
          size="large"
          disabled={!isAOwner}
          onClick={handleCreateTransaction}
        >
          {isAOwner ? "Create Transaction" : "You are not an owner"}
        </Button>
      </div>
      <br />

      <br />
      <br />
      {transactions.length > 0 ? (
        <TableContainer>
          <Table
            sx={{ width: 1200, margin: "auto" }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Recipient</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Send or Not</StyledTableCell>
                <StyledTableCell>No. Of Approvals</StyledTableCell>
                {isAOwner ? (
                  <>
                    <StyledTableCell>Approved By You ?</StyledTableCell>
                    <StyledTableCell>Want to Approve</StyledTableCell>
                  </>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell>{row.to}</StyledTableCell>
                  <StyledTableCell>{row.amount}</StyledTableCell>
                  <StyledTableCell>{row.isSent ? "Yes" : "No"}</StyledTableCell>
                  <StyledTableCell>{row.approvals}</StyledTableCell>
                  {isAOwner ? (
                    <>
                      <StyledTableCell>
                        {row.yourApproval ? "Yes" : "No"}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          disabled={row.yourApproval}
                          variant="outlined"
                          onClick={() => handleApproveTransaction(row.id)}
                        >
                          Approve
                        </Button>
                      </StyledTableCell>
                    </>
                  ) : null}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>
          <img src="./NoRecordFound.png" alt="No Display" />
        </div>
      )}
    </div>
  ) : (
    <ProgressBar />
  );
};
