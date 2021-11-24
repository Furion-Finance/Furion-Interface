import { Grid, Button } from "@material-ui/core";
import { Item } from "src/components/Item";
import { SingleNFT } from "..";
import "./NftOverview.scss"

const NftOverview = ({ nft_collections, change_nft, detail_type }) => {

    const get_preview = (uri) => {
        // console.log(JSON.parse(uri)['image_url']);
        try {
            return JSON.parse(uri)['image_url'];
        } catch (e) {
            return "/image.jpg";
        }
    }

    return (
        // <Button onClick={this.test} variant="standard">{this.props.ha}</Button>
        <Grid container spacing={2}>
            {nft_collections.map((option) => {
                return (
                    <Grid item xs={3}>
                        <Item class="nft_display">
                            <SingleNFT
                                nft_project_name={option.nft_project_name}
                                nft_project_address={option.nft_project_address}
                                token_id={option.token_id}
                                img_url={get_preview(option.uri)}
                                locked={option.locked}
                                change_nft={change_nft}
                                detail_type={detail_type} />
                        </Item>
                    </Grid>
                )
            }
            )}
        </Grid>
    );
    // }

}
export default NftOverview;