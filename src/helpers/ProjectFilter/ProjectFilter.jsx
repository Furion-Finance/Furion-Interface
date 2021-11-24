import React from "react";
import { List, ListItemIcon, ListItem, ListSubheader, ListItemText } from "@material-ui/core";
import { TextField, Grid, Checkbox } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import "./ProjectFilter.scss"

export default function ProjectFilter() {

    const projects = ['CyberKongz', 'CryptoPunk', 'Axies Infinity']

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const [checked, setChecked] = React.useState([0]);

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="project-list-subheader">
                    NFT Project Filter
                </ListSubheader>
            }
        >
            <ListItem id="search">
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={3}>
                        <Search />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField id="input-with-icon-grid" />
                    </Grid>
                </Grid>
            </ListItem>


            {projects.map((value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                    <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked.indexOf(value) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} class="project_name" primary={value} />
                    </ListItem>
                );
            })}
        </List>
    );
}
