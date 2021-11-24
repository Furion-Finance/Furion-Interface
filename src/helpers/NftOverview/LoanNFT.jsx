import { Grid } from "@material-ui/core";
import { Item } from "src/components/Item";
import { SingleNFT } from "..";
import "./LoanNFT.scss"

const LoanNFT = ({ change_nft, detail_type }) => {
    const nft_collections = [
        { "nft_project": "DemoPunk", "token_id": 1, "locked": false },
        { "nft_project": "DemoPunk", "token_id": 2, "locked": false },
        { "nft_project": "DemoPunk", "token_id": 3, "locked": false },
        { "nft_project": "DemoPunk", "token_id": 4, "locked": false },
        { "nft_project": "DemoPunk", "token_id": 5, "locked": false },
        { "nft_project": "DemoPunk", "token_id": 6, "locked": false }
    ];

    return (
        <Grid container spacing={2}>
            {nft_collections.map((option) => (
                <Grid item xs={3}><Item class="nft_display"> <SingleNFT nft_project={option.nft_project} token_id={option.token_id} change_nft={change_nft} locked={option.locked} detail_type={detail_type} /> </Item></Grid>
            ))}
        </Grid>
    );
}
export default LoanNFT;