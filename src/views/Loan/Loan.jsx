import { Box, Grid, Paper, Tab, Tabs, Zoom, Button } from "@material-ui/core";
import { ProjectFilter, LoanNFT } from "src/helpers";
import TabPanel from "../../components/TabPanel";
import { useState } from "react";
import './Loan.scss';

function Loan({change_nft}) {
  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);

  const changeView = (event, newView) => {
    setView(newView);
  };
  
  return (
    <div id="loan-view">
      
      <Zoom in={true} onEntered={setZoomed}>
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
                <Tab label="Lend" />
                <Tab label="Borrow" />
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
                      <LoanNFT change_nft={change_nft} detail_type={"/lend_detail"} />
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
                      <LoanNFT change_nft={change_nft} detail_type={"/borrow_detail"} />
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

            </Grid>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );

}

export default Loan;