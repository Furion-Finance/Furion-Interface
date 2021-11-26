import React, { useState, useEffect } from "react";
import { Grid, Button, IconButton, TextField, MenuItem, Typography, SvgIcon } from "@material-ui/core";
import "./PriceIntro.scss";
import InfoIcon from '@material-ui/icons/Info';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';

import { useSelector, useDispatch } from "react-redux";
import { get_price } from "src/redux/priceAction";

const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
  
    if (value == 225) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red" viewBox="0 0 1024 1024">
          <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
        </svg>
      );
    }

    return null;
};

export default function PriceIntro({nft_project_name, nft_project_address, token_id}) {
    const dispatch = useDispatch();
    const price = useSelector(state => state.price);
    useEffect(()=>{
        dispatch(get_price(nft_project_address, token_id));
    }, [price]);
    const borderstyle={border: "0px dashed blue", width: "100%" }; //used for debugging Grid Edges, change for 1px to take effect
    const data = [
        {
            name: '$190',
            pd: 0.032,
        },
        {
            name: '$195',
            pd: 0.053,
        },
        {
            name: '$200',
            pd: 0.126,
        },
        {
            name: '$205',
            pd: 0.248,
          },
        {
            name: '$210',
            pd: 0.402,
        },
        {
            name: '$215',
            pd: 0.577,
        },
        {
            name: '$220',
            pd: 0.735,
        },
        {
            name: '$225',
            pd: 0.824,
        },
        {
            name: '$230',
            pd: 0.867,
        },
        {
            name: '$235',
            pd: 0.889,
        },
        {
            name: '$240',
            pd: 0.904,
        },
        {
            name: '$245',
            pd: 0.914,
        },
        {
            name: '$250',
            pd: 0.920,
        },
        {
            name: '$255',
            pd: 0.926,
        },
        {
            name: '$260',
            pd: 0.93,
        },
        {
            name: '$265',
            pd: 0.933,
          },
        {
            name: '$270',
            pd: 0.935,
        }
      ]; //Mock datas
    
    const [showResults, setShowResults] = React.useState(false);
    const onClicking = () => setShowResults(!showResults);

    return (
        <div>
            <div id="price-info">
                <Grid container direction="row" xs={12} alignItems="flex-start" style={borderstyle}> {/* First Grid LEFT | RIGHT */}
                    <Grid container direction="column" alignItems="flex-start" xs={6} style={borderstyle}> {/* Grid LEFT UP / LEFT DOWN */}
                        <Grid item xs={12} style={borderstyle}>
                            <Typography gutterBottom variant="h5">
                                {nft_project_name + ' # ' + token_id}
                            </Typography>
                        </Grid>
                        <br />
                        <br />
                        <Grid container direction="row" alignItems="flex-start"> {/* Grid LEFT DOWN LEFT / LEFT DOWN RIGHT */}
                            <Grid item xs={9} style={borderstyle}>
                                <Typography gutterBottom variant="h5">
                                    Reference Price: <br /> {price.price} USD
                                </Typography>
                            </Grid>
                            <Grid item xs={3} style={borderstyle}>
                                <IconButton aria-label="info" margin='0' onClick={onClicking}>
                                    <SvgIcon color="primary" component={InfoIcon}/>
                                </IconButton>
                            </Grid>
                        </Grid> 
                    </Grid>
                    <Grid item alignItems="flex-start" xs={6} style={borderstyle}>
                        {
                            showResults ?
                                <div>                        
                                <LineChart
                                    width={200}
                                    height={181}
                                    data={data}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <ReferenceLine x="$215" stroke="red" strokeDasharray="2 4" />
                                    <ReferenceLine x="$240" stroke="red" strokeDasharray="2 4" />
                                    <ReferenceDot x="$225" r={10} fill="red" stroke="none" />
                                    <Line type="monotone" dataKey="pd" stroke="#8884d8" dot={<CustomizedDot />} name="Price Distribution" />
                                    {/*  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />*/}
                                </LineChart> 
                                </div>: null
                        }
                    </Grid>
                </Grid> 
                <br />
            </div>
        </div>
    );
}
