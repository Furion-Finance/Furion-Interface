import React, { useState } from "react";
import { Grid, Button, TextField, MenuItem, Typography } from "@material-ui/core";
import "./LendIntro.scss";

const currencies = [
    {
        value: 'USD',
        label: 'USD',
    },
    {
        value: 'ETH',
        label: 'ETH',
    },
    {
        value: 'BTC',
        label: 'BTC',
    }
];

const timeUnits = [
    {
        value: 'Day',
        label: 'Day',
    },
    {
        value: 'Block',
        label: 'Block',
    },
];

export default function LendIntro({nft_project, token_id}) {
    const [currency, setCurrency] = React.useState('USD');
    const [time, setTime] = React.useState("Day");
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };
    const handleTimeChange = (event) => {
        setTime(event.target.value)
    }
    return (
        <div>
            <div>
                <Grid container alignItems="center">
                    <Grid item xs={6}>
                        <Typography gutterBottom variant="h5">
                            {nft_project + ' ' + token_id}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography gutterBottom variant="h5">
                            Owner: 0x0001...0001
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={8}>
                        <Typography gutterBottom variant="h5">
                            List Time: 1st Jan 2021
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="h5">
                            Block: 12345
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                <Grid container alignItems="center">
                    <Grid item xs={8}>
                        <Typography gutterBottom variant="h5">
                            Reference Price: 220.00 USD
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container alignItems="center">
                    <Grid item xs={5}>
                        <Grid container alignItems="center">
                            <Grid item xs={9} id="loan-value-input">
                                <TextField variant="outlined" label="Loan Value" size="small" 
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} id="currency-grid">
                                <TextField
                                    id="select-currency"
                                    select
                                    value={currency}
                                    onChange={handleCurrencyChange}
                                    variant="outlined"
                                    size="small"
                                >
                                    {currencies.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={5}>
                        <Grid container alignItems="center">
                            <Grid item xs={9} id="loan-value-input">
                                <TextField variant="outlined" label="Loan Peroid" size="small" 
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} id="currency-grid">
                                <TextField
                                    id="select-currency"
                                    select
                                    value={time}
                                    onChange={handleTimeChange}
                                    variant="outlined"
                                    size="small"
                                >
                                    {timeUnits.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" size="medium">Quote</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
