import { Card, CardActionArea, CardContent, CardMedia } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import "./SingleNFT.scss";

export default function SingleNFT({ nft_project_name, nft_project_address, token_id, img_url, locked, change_nft, detail_type }) {
    const redirect_nft = () => {
        change_nft(nft_project_name, nft_project_address, token_id, img_url, detail_type);
    }

    return (
        <Card class={"nft_card" + " " + locked} onClick={()=>{
            if(locked){
                detail_type = '/unlock_detail'
            }
            redirect_nft()}} >
            <CardActionArea>
                <CardMedia>
                    <div class='img_div'>
                        <img src={img_url} objectFit="cover"
                         />
                    </div>
                </CardMedia>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h3" class="nft_title">
                        {nft_project_name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h3" class="nft_token_id">
                        {'#  ' + token_id}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
