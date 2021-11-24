import { styled } from '@material-ui/core';
import {Paper} from '@material-ui/core';
export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    // padding: theme.spacing(10),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));