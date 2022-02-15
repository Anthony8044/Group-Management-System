import { makeStyles } from '@mui/styles';

const drawerWidth = 300

export default makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    page: {
        background: '#f9f9f9',
        width: '100%'
    },
    appBar: {
        //zIndex: theme.zIndex.drawer + 1
        zIndex: "1251 !important",
        backgroundColor: "#1D2731 !important"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        zIndex: "1250 !important"
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: "#e8ebed !important",
        color: "#0a3b5b !important"
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("md")]: {
            display: "none !important"
        }
    },
    toolbar: {
        ...theme.mixins.toolbar,
        [theme.breakpoints.down("sm")]: {
            display: "none !important"
        }
    },
    title:{
        flexGrow: 1
    },
    avatar: {
        margin: theme.spacing(2),
        height: '30px !important', 
        width: '30px !important',
    },
    menuItems: {
      marginTop: "20px !important" 
    },
    innerItemsText: {
        justifySelf: "right !important" 
      },
    profile: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
    button: {
        margin: theme.spacing(2) + "!important"
    },
    name: {

    },
}));