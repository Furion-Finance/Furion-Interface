import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls.jsx";
import LoopIcon from '@material-ui/icons/Loop';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import { shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import "./sidebar.scss";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("loan") >= 0 && page === "loan") {
      return true;
    }
    if (currentPath.indexOf("liquidity_pool") >= 0 && page === "liquidity_pool") {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            {/* we need to write our homepage here */}
            <Link href="" target="_blank">
              <img src="./img/Furion.jpg"
                style={{ minWdth: "151px", minHeight: "151px", width: "300px", marginLeft: "-12%"}}
              />
            </Link>

            {address && (
              <div className="wallet-link">
                <Link href={`https://etherscan.io/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="loan-nav"
                to="/liquidity_pool"
                isActive={(match, location) => {
                  return checkPage(match, location, "liquidity_pool");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <LoopIcon />
                  Furion Pool
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="loan-nav"
                to="/loan"
                isActive={(match, location) => {
                  return checkPage(match, location, "loan");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <MonetizationOnIcon />
                  Furion Lending
                </Typography>
              </Link>

            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
