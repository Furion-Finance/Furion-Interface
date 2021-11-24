import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";

import { storeQueryParameters } from "./helpers/QueryParameterHelper";

import { Loan, LendDetail, BorrowDetail, LiquidityPool, StakeDetail, UnstakeDetail, UnlockDetail } from "./views";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import NotFound from "./views/404/NotFound";

import { dark as darkTheme } from "./themes/dark.js";
import { light as lightTheme } from "./themes/light.js";
import { girth as gTheme } from "./themes/girth.js";

import "./style.scss";

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App(props) {
  useGoogleAnalytics();
  useSegmentAnalytics();
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const location = useLocation();
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const { connect, hasCachedProvider, provider, chainID, connected } = useWeb3Context();

  const [walletChecked, setWalletChecked] = useState(false);

  const [nft_project_name, setNftProjectName] = useState("Loading");
  const [nft_project_address, setNftProjectAddress] = useState('');
  const [token_id, setTokenId] = useState(0);
  const [detail_type, setDetailType] = useState("/injection_detail");
  const [img_url, setImgUrl] = useState("./image.jpg");

  const history = useHistory();
  const change_nft = useCallback((new_nft_project_name, new_nft_project_address, new_token_id, new_img_url, new_detail_type) => {
    setNftProjectName(new_nft_project_name);
    setNftProjectAddress(new_nft_project_address);
    setTokenId(new_token_id);
    setDetailType(new_detail_type);
    setImgUrl(new_img_url);
    history.push(new_detail_type);
  }, [nft_project_name, nft_project_address, token_id, img_url, detail_type]);

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }

    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
    storeQueryParameters();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  let themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;

  useEffect(() => {
    themeMode = theme === "light" ? lightTheme : darkTheme;
  }, [theme]);

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);


  return (
    // <div>{furion.liquidity_pool_address}</div>
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
        {/* <Messages /> */}
        <TopBar theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
        <nav className={classes.drawer}>
          {isSmallerScreen ? (
            <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          ) : (
            <Sidebar />
          )}
        </nav>

        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/liquidity_pool" />
            </Route>

            <Route path="/liquidity_pool">
              <LiquidityPool change_nft={change_nft} />
            </Route>

            <Route path="/loan">
              <Loan change_nft={change_nft} />
            </Route>

            <Route path="/lend_detail">
              <LendDetail
                nft_project_name={nft_project_name}
                nft_project_address={nft_project_address}
                token_id={token_id}
                img_url={img_url}
                change_nft={change_nft}
              />
            </Route>

            <Route path="/borrow_detail">
              <BorrowDetail
                nft_project_name={nft_project_name}
                nft_project_address={nft_project_address}
                token_id={token_id}
                img_url={img_url}
                change_nft={change_nft}
              />
            </Route>

            <Route path="/injection_detail">
              <StakeDetail
                nft_project_name={nft_project_name}
                nft_project_address={nft_project_address}
                token_id={token_id}
                img_url={img_url}
                change_nft={change_nft}
              />
            </Route>

            <Route path="/stripping_detail">
              <UnstakeDetail
                nft_project_name={nft_project_name}
                nft_project_address={nft_project_address}
                token_id={token_id}
                img_url={img_url}
                change_nft={change_nft}
              />
            </Route>

            <Route path="/unlock_detail">
              <UnlockDetail
                nft_project_name={nft_project_name}
                nft_project_address={nft_project_address}
                token_id={token_id}
                img_url={img_url}
                change_nft={change_nft}
              />
            </Route>

            

            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
