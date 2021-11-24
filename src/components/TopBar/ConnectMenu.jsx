import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";

function ConnectMenu({ theme }) {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  // different action type according to account state and pending transactions
  const [isConnected, setConnected] = useState(connected);

  // const pendingTransactions = useSelector(state => {
  //   return state.pendingTransactions;
  // });
  const pendingTransactions = [];

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }

  const primaryColor = theme === "light" ? "#0428f7" : "#F8CC82";

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div
      className="wallet-menu"
      id="wallet-menu"
    >
      <Button
        className="connect-button"
        variant="contained"
        color="secondary"
        size="large"
        style={{color: primaryColor, fontStyle: "bold" }}
        onClick={clickFunc}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        key={1}
      >
        {buttonText}
      </Button>
    </div>
  );
}

export default ConnectMenu;