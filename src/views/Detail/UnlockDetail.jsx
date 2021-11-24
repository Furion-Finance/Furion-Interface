import { Box, Grid, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Zoom } from "@material-ui/core";
import { useState } from "react";
import { PriceIntro } from "../../helpers";
import './UnlockDetail.scss';

import { useAddress } from "src/hooks";
import { useSelector } from "react-redux";

function createData(account, operation_type, operation_date, fUSD_amount) {
    return { account, operation_type, operation_date, fUSD_amount };
}

const rows = [
    createData('0x000...001', "Injection", "1st Jan 2021", 100),
    createData('0x000...002', "Unlock", "2nd Jan 2021", 200),
];

function UnstakeDetail({ nft_project_name, nft_project_address, token_id, img_url, change_nft }) {
    const [zoomed, setZoomed] = useState("false");
    const furion = useSelector(state => state.furion);
    const account = useAddress();

    const unlockNFT = async (furion, account) => {
        console.log('Processing unlock');
        // console.log('This is furion from unlock', furion);
        // console.log('This is account from unlock', account);
        furion.liquidity_pool.methods.unlockNFT(nft_project_address, token_id).send({ from: account }).on("transactionHash", (hash) => {
            console.log(token_id, "get successfully unlocked!");
            change_nft(nft_project_name, nft_project_address, token_id, img_url, "/injection_detail");
        })
    }

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
                                            <img src={img_url} layout="fill" objectFit="cover" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Grid container spacing={0.5} direction="column" >
                                            <Grid item>
                                                <PriceIntro
                                                    nft_project_name={nft_project_name}
                                                    nft_project_address={nft_project_address}
                                                    token_id={token_id}
                                                />
                                            </Grid>
                                            <Grid item alignItems="center">
                                                <Button variant="contained" color="primary" size="medium" id="unstake"
                                                    onClick={() => {
                                                        unlockNFT(furion, account);
                                                    }}
                                                >Unlock</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                        </Grid>
                        <br />
                        <Grid item class='staking-history'>
                            <div className="table-intro" id="borrow-table-head">
                                <Typography variant="h5">Staking History</Typography>
                            </div>
                        </Grid>
                        <br />
                        <Grid>
                            <TableContainer component={Paper} id="table-paper">
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Account</TableCell>
                                            <TableCell align="center">Operation Type</TableCell>
                                            <TableCell align="center">Operation Date</TableCell>
                                            <TableCell align="center">fUSD Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.account}>
                                                <TableCell component="th" scope="row" align="center">
                                                    {row.account}
                                                </TableCell>
                                                <TableCell align="center">{row.operation_type}</TableCell>
                                                <TableCell align="center">{row.operation_date}</TableCell>
                                                <TableCell align="center">{row.fUSD_amount}</TableCell>
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

export default UnstakeDetail;