import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Zoom} from "@material-ui/core";
import { useState } from "react";
import {LendIntro} from "../../helpers";
import './LendDetail.scss';

function createData(account, quote_date, loan_value, duration) {
  return { account, quote_date, loan_value, duration};
}

const rows = [
  createData('0x000...001', "1st Jan 2021", "10.0 wETH", "7 days"),
  createData('0x000...002', "1st Jan 2021", "10.0 USDC", "700 blocks"),
];

function LendDetail({nft_project, token_id}) {
  const [zoomed, setZoomed] = useState("false");
    return (
      <div id="loan-view">
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <Paper className={`ohm-card`}>
            <Grid container direction="column" spacing={2}>

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
                      <Grid item xs={7}>
                        <LendIntro nft_project={nft_project} token_id={token_id} />
                      </Grid>
                    </Grid>
                  </Box>

              </Grid>

              <Grid item>
                <div className="table-intro" id="table-head">
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

export default LendDetail;