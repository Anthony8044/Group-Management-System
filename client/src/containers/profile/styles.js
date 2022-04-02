import { makeStyles } from '@mui/styles';


export default makeStyles((theme) => ({
    avatar: {
        marginTop: '50px',
        margin: 'auto',
        height: '200px !important',
        width: '200px !important',
    },
    profileTitle: {
        textAlign: 'center'
    },
    infoContent: {
        margin: theme.spacing(2),
    },
    selected: {
        backgroundColor: "turquoise !important",
    }
}));