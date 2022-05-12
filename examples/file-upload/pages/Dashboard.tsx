import * as React from 'react';
import { useCallback } from "react";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Title from './Title';
import { useRouter } from "next/router";
import { getItemContract } from "../hooks/getItemContract";

interface RatingRecordRow {
    date: any;
    userAddress: string;
    ratingScore: number;
    reviewContent: string;
}

import {
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Collapse,
    Button,
    Grid,
    TextField,
    Card,
} from '@mui/material';
import { LoopTwoTone } from '@mui/icons-material';
import { isAssetError } from 'next/dist/client/route-loader';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

interface Props {
    itemId: Number;
    walletAddress: string;
}


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const mdTheme = createTheme();

function DashboardContent() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [itemId, setItemId] = React.useState<number>(0);
    const [itemRate, setItemRate] = React.useState<number>(0);
    const [itemComment, setItemComment] = React.useState<string>("");
    const [itemTotalRate, setItemTotalRate] = React.useState<number>(0);
    const [itemTotalCount, setItemTotalCount] = React.useState<number>(0);
    const [itemCommentNum, setItemCommentNum] = React.useState<number>(0);
    const [ratingRecords, setRatingRecords] = React.useState<RatingRecordRow[]>([]);
    const [itemDesc, setItemDesc] = React.useState<string>("");
    const [itemName, setItemName] = React.useState<string>("");
    const [itemOwner, setItemOwner] = React.useState<string>("");
    const [itemCover, setItemCover] = React.useState<string>("")
    const [isRating, setIsRating] = React.useState<boolean>(false);

    const { query } = useRouter();

    const { contract } = getItemContract();

    var getArrayFromLength = (length: number) => Array.from({ length }).map((v, k) => k);

    const getItemByID = useCallback(async () => {
        if (contract) {
            const result = await contract.getItemById(query.itemId);
            setItemOwner(result.owner);
            setItemName(result.itemName);
            setItemCommentNum(result.totalCount);
            setItemDesc(result.itemDescription);
            setItemCover(result.itemCoverHash);
            setItemTotalRate(result.totalRating.toNumber());
            setItemTotalCount(result.totalCount.toNumber());
            console.log(result)
        }
    }, [contract]);

    const getItemRatingRecords = useCallback(async () => {
        if (contract) {
            const result = await contract.getRatingListById(query.itemId);
            setRatingRecords(result);
        }
    }, [contract])

    const filterTime = (time: number) => {
        return new Date(time * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
    }


    const handleItemRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemRate(Number(event.target.value))
        if (itemRate < 0 || itemRate > 5) {
            window.alert("Please Rate 0 to 5")
        }
    }
    const handleItemCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemComment(event.target.value)
        if (itemRate < 0 || itemRate > 5) {
            window.alert("Please Rate 0 to 5")
        }
    }


    // Initiate Page
    React.useEffect(() => {
        getItemByID();
        getItemRatingRecords();
    }, [])

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Item Details
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            {/* Recent ItemInfo */}
                            <Grid item xs={12} md={8} lg={9}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    {/* ItemInfo */}
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            {/*Item Name*/}
                                            <Typography component="p" variant="h4">
                                                {itemName}
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={12}>
                                            {/*Item Name*/}
                                            <Typography component="p">
                                                <br></br>
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <img
                                                style={{ width: 140, height: 100, marginTop: 1 }}
                                                src="https://s3.bmp.ovh/imgs/2022/05/05/0ad9a0ed1a3a5f7d.webp"
                                            >

                                            </img>
                                        </Grid>
                                        <Grid item xs={6}>

                                            <Typography component="p" variant="h6">
                                                Item Description
                                            </Typography>
                                            <Typography component="p" >
                                                {itemDesc}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                </Paper>
                            </Grid>
                            {/* AverageRating */}
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    <React.Fragment>
                                        <Grid container spacing={1}>
                                            <Collapse in={!isRating}>
                                                <Grid item xs={12}>

                                                    <Title>Average Rating</Title>

                                                </Grid>
                                                <Grid item xs={12}>

                                                    <Grid item xs={4}>
                                                        <Typography component="p" variant="h4">
                                                            { itemTotalCount === 0 ? 0 : itemTotalRate / itemTotalCount}
                                                        </Typography>
                                                    </Grid>

                                                </Grid>
                                            </Collapse>
                                            <Grid item xs={12}>
                                                <Collapse in={!isRating}>

                                                    <Button
                                                        sx={{ mt: 3 }}
                                                        variant="contained"
                                                        onClick={() => { setIsRating(true) }}>
                                                        Rate
                                                    </Button>

                                                </Collapse>
                                                <Collapse in={isRating}>
                                                    <TextField
                                                        sx={{ mt: 3 }}
                                                        required
                                                        fullWidth
                                                        id="ItemRate"
                                                        label="Item Rate"
                                                        name="Item Rate"
                                                        value={itemRate}
                                                        onChange={handleItemRateChange}
                                                    />
                                                    <TextField
                                                        sx={{ mt: 2 }}
                                                        required
                                                        fullWidth
                                                        id="itemDescription"
                                                        label="Item Description"
                                                        name="Item Description"
                                                        value={itemComment}
                                                        onChange={handleItemCommentChange}
                                                    />
                                                    <Button
                                                        sx={{ mt: 2 }}
                                                        variant="contained"
                                                        onClick={async () => {
                                                            if (contract) {
                                                                try {
                                                                    await contract.addReview(query.itemId, itemRate, itemComment);
                                                                }
                                                                catch(err) {
                                                                    window.alert("Do not rate more than once!")
                                                                }
                                                            }
                                                            setIsRating(false);
                                                            getItemRatingRecords();
                                                        }}>
                                                        Confirm
                                                    </Button>
                                                </Collapse>
                                            </Grid>
                                        </Grid>

                                    </React.Fragment >
                                </Paper>
                            </Grid>
                            {/* Rating Comments */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ width: '100%', minWidth: 860, minHeight: 80, bgcolor: 'background.paper' }}>
                                        {ratingRecords.map((record) => {
                                            const labelId = `checkbox-list-secondary-label-${record.userAddress}`;
                                            return (
                                                <Card
                                                    sx={{ width: '100%', minwidth: 800, minHeight: 100, marginTop: 3, marginBottom: 3 }}
                                                    key={record.userAddress}>
                                                    <Grid container spacing={1}>

                                                        <Grid item xs={1}>
                                                            <Typography
                                                                style={{
                                                                    fontWeight: "bold",
                                                                    marginTop: 2,
                                                                    alignItems: "center"
                                                                }}>
                                                                { }
                                                            </Typography>

                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <Typography
                                                                        style={{
                                                                            fontWeight: "bold",
                                                                            marginTop: 2,
                                                                            alignItems: "center"
                                                                        }}>
                                                                        {`From: ${record.userAddress}`}
                                                                    </Typography>

                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography>
                                                                        {`Comment: ${record.reviewContent}`}
                                                                    </Typography>

                                                                </Grid>

                                                            </Grid>

                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <Typography
                                                                        style={{
                                                                            marginTop: 2,
                                                                            alignItems: "center"
                                                                        }}>
                                                                        {`At: ${filterTime(record.date.toNumber())}`}
                                                                    </Typography>

                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography>
                                                                        {`Rated: ${record.ratingScore}`}
                                                                    </Typography>

                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            );
                                        })}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent />;
}