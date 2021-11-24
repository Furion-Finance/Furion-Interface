import React, { useState, useEffect } from "react";
import { Grid, Button, TextField, MenuItem, Typography } from "@material-ui/core";
import "./PriceIntro.scss";

import { useSelector, useDispatch } from "react-redux";
import { get_price } from "src/redux/priceAction";

export default function PriceIntro({nft_project_name, nft_project_address, token_id}) {
    const dispatch = useDispatch();
    const price = useSelector(state => state.price);
    useEffect(()=>{
        dispatch(get_price(nft_project_address, token_id));
    }, [price]);

    return (
        <div>
            <div id="price-info">
                <Grid container alignItems="center">
                    <Typography gutterBottom variant="h5">
                        {nft_project_name + ' # ' + token_id}
                    </Typography>
                </Grid>
                <br />
                
                <Grid container alignItems="center">
                    <Grid item xs={8}>
                        <Typography gutterBottom variant="h5">
                            Reference Price: {price.price} USD
                        </Typography>
                    </Grid>
                </Grid>            
            </div>
        </div>
    );
}
