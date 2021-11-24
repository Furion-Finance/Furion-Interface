import { SvgIcon, Button, Typography, Box} from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";

import "./TokenMenu.scss";
function TokenMenu(){
  return (
    <Box
      component="div"
      id="token-button-hover"
    >
      <Button id="token-button" size="large" variant="contained" color="secondary" title="FUR">
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>FUR</Typography>
      </Button>
    </Box>
  );
}

export default TokenMenu;