import { Box, Grid, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Zoom } from "@material-ui/core";
import { useState } from "react";
import { PriceIntro } from "../../helpers";
import './BorrowDetail.scss';

function createData(account, quote_date, loan_value, duration) {
  return { account, quote_date, loan_value, duration };
}

const rows = [
  createData('0x000...001', "1st Jan 2021", "10.0 wETH", "7 days"),
  createData('0x000...002', "1st Jan 2021", "10.0 USDC", "700 blocks"),
];

function BorrowDetail({ nft_project, token_id }) {
  const [zoomed, setZoomed] = useState("false");
  return (
    <div id="loan-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={0.5}>

            <Grid item>
              <div className="card-header">
                <Typography variant="h2">Detail</Typography>
              </div>
            </Grid>

            <Grid item>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <div class='img_div'>
                      <img src="/image.jpg" layout="fill" objectFit="cover" />
                    </div>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container spacing={0.5} direction="column" >
                      <Grid item>
                        <PriceIntro nft_project={nft_project} token_id={token_id} />
                      </Grid>
                      <Grid item alignItems="center">
                        <Button variant="contained" color="primary" size="medium" id="deposit">Deposit to Borrow</Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

            </Grid>
            <br />
            <Grid item>
              <div className="table-intro" id="borrow-table-head">
                <Typography variant="h5">Quote History</Typography>
              </div>
            </Grid>
            <br />
            <Grid>
              <TableContainer component={Paper} id="table-paper">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Lender</TableCell>
                      <TableCell align="center">Quote Date</TableCell>
                      <TableCell align="center">Loan Value</TableCell>
                      <TableCell align="center">Duration</TableCell>
                      <TableCell align="center">Operation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.account}>
                        <TableCell component="th" scope="row" align="center">
                          {row.account}
                        </TableCell>
                        <TableCell align="center">{row.quote_date}</TableCell>
                        <TableCell align="center">{row.loan_value}</TableCell>
                        <TableCell align="center">{row.duration}</TableCell>
                        <TableCell align="center"><Button variant="contained" color="primary" size="small">Match</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default BorrowDetail;