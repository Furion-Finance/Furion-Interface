import { Box, Grid, Paper, Tab, Tabs, Zoom, Typography } from "@material-ui/core";
import { ProjectFilter, NftOverview } from "src/helpers";
import TabPanel from "../../components/TabPanel";
import { useState, useEffect } from "react";

import { useAddress } from "src/hooks";
import { useSelector, useDispatch } from "react-redux";
import './LiquidityPool.scss';

import {initialize_project, get_account_collections, get_pool_collections} from "src/redux/projectAction";
import {initialize_furion} from "src/redux/furionAction";

function LiquidityPool({ change_nft }) {
  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const account = useAddress();
  const dispatch = useDispatch();

  const furion = useSelector(state => state.furion);
  const project = useSelector(state => state.project);
  const changeView = (event, newView) => {
    if(newView === 0){
      dispatch(get_pool_collections(furion.liquidity_pool, project.nft_project, account))
    }else if(newView === 1){
      dispatch(get_account_collections(furion.liquidity_pool, project.nft_project, account))
    }
    setView(newView);
  };
  const furion_result = initialize_furion();

  useEffect(()=>{
    dispatch(furion_result);
    dispatch(initialize_project(furion_result['payload']['liquidity_pool']));
  }, []);

  return (
    <div id="loan-view">
      <Zoom in={true} onEntered={setZoomed}>
        {/* <div>
          <h2>pool nft {project.pool_nft}</h2>
          <h2>account nft {project.account_nft}</h2>
          <h2>locking nft {project.lock_nft}</h2>
        </div> */}
        
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>

            <Grid item>
              <Tabs
                key={String(zoomed)}
                onChange={changeView}
                centered
                value={view}
                textColor="primary"
                variant="standard"
                indicatorColor="primary"
                className="stake-tab-buttons"
              >
                <Tab label="Pool" />
                <Tab label="Account" />
              </Tabs>
            </Grid>

            <Grid item>
              <TabPanel value={view} index={0} className="lend-tab-panel">
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <ProjectFilter />
                    </Grid>
                    <Grid item xs={9}>
                      <NftOverview nft_collections={project.pool_collections} change_nft={change_nft} detail_type={"/stripping_detail"} />
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
              <TabPanel value={view} index={1} className="borrow-tab-panel">
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <ProjectFilter />
                    </Grid>
                    <Grid item xs={9}>
                      <NftOverview nft_collections={project.account_collections} change_nft={change_nft} detail_type={"/injection_detail"} />
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
              <Typography variant="h6" id="remark">Remark: The ones enclosed by red frames are personally locked.</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );

}

export default LiquidityPool;