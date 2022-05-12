import { json_rpc_methods } from "@etherdata-blockchain/etherdata-sdk";
import {
    BrowserFile,
    BrowserFileObject,
} from "@etherdata-blockchain/etherdata-sdk-file-browser";
import { CatchingPokemonSharp, Clear, Done, IndeterminateCheckBoxRounded, VapingRooms } from "@mui/icons-material";
import { TabContext } from "@mui/lab";
import {
    Alert,
    Button,
    CardMedia,
    Collapse,
    Divider,
    IconButton,
    Stack,
    styled,
    Typography,
    FormControlLabel,
    Container,
    Link,
    Grid,
    TextField,
    CssBaseline,
    Tab,
    Card,
    alpha
} from "@mui/material";
import { Box } from "@mui/system";
import { GetServerSideProps } from "next";
import React, { useCallback, useEffect } from "react";
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import router from "next/router";
import qs from "query-string";
import { getItemContract } from "../hooks/getItemContract";
import { StringDecoder } from "string_decoder";
import { render } from "react-dom";

interface ItemRow {
    owner: string;
    itemId: any;
    itemName: string;
    itemDescription: string;
    itemCoverHash: string;
    totalRating: number;
    totalCount: number;
}

interface Props {
    balance: number;
    walletAddress: string;
}

const Input = styled("input")({
    display: "none",
});

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Upload({ balance, walletAddress }: Props) {
    // uploaded file state
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const [fileId, setFileId] = React.useState<string>();
    const [isAdding, setIsAdding] = React.useState<boolean>(false);
    const [isRating, setIsRating] = React.useState<boolean>(false)
    const [tabValue, setTableValue] = React.useState('1');
    const [isUploaded, setIsUploaded] = React.useState<boolean>(false);
    const [itemId, setItemId] = React.useState<string>("");
    const [itemName, setItemName] = React.useState<string>("");
    const [itemDesc, setItemDesc] = React.useState<string>("");


    const [ownedItems, setOwnedItems] = React.useState<ItemRow[]>([]);
    const [joinedItems, setJoinedItems] = React.useState<ItemRow[]>([]);
    // react functional


    let ownedLoop: Array<number> = [];
    let joinedLoop: Array<number> = [];

    var getArrayFromLength = (length: number) => Array.from({ length }).map((v, k) => k);

    const { contract } = getItemContract();

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTableValue(newValue);
    };

    const upload = useCallback(async () => {
        if (file) {
            try {
                const browserFile = new BrowserFile(process.env.NEXT_PUBLIC_FILE_URL!);
                const fileObject = new BrowserFileObject({ file: file, days: 2 });

                const fileId = await browserFile.uploadFile(fileObject);
                setFileId(fileId);
            } catch (err) {
                window.alert("Cannot upload file");
            }
        }
    }, [file]);

    const updateIsAdding = useCallback(async () => {
        try {
            setIsAdding(!isAdding);
        } catch (err) {

        }
    }, [isAdding]);

    const updateIsRating = useCallback(async () => {
        try {
            setIsRating(!isRating);
        } catch (err) {

        }
    }, [isRating]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    const handleItemNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemName(event.target.value);
    };

    const handleAlbumDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemDesc(event.target.value);
    };

    const handleItemIdChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemId(event.target.value);
    };

    const getCreatedItemList = useCallback(async () => {
        try {
            if (contract) {
                const ownedItems = await contract.getCreatedItemByAddress();
                setOwnedItems(ownedItems);
                console.log(ownedItems);
            }
        }
        catch (err) {
            window.alert(err)
            console.log(err);
        }

    }, [contract]);

    const getJoinedItemList = useCallback(async () => {
        try {
            if (contract) {
                const joinedItems = await contract.getRatedItemByAddress();
                setJoinedItems(joinedItems);
            }
        }
        catch (err) {
            window.alert(err)
        }
    }, [contract])

    React.useEffect(() => {
        getCreatedItemList();
        getJoinedItemList();
    }, [])

    return (
        <Stack alignItems={"center"} width="100vw" spacing={1}>
            <Box mt={10} mb={5} />
            <Typography variant="h5" fontWeight={"bolder"}>
                Wallet Address: {walletAddress}
            </Typography>
            <Typography variant="h6">
                Balance: {balance / 1000000000000000000} ETD
            </Typography>
            {/* Creata New && Rate Now Buttons Group */}
            <Collapse in={isAdding === false && isRating === false}>
                <label htmlFor="contained-button-file">
                    <Input accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={(e) => {
                            if (e.target.files) {
                                setFile(e.target.files[0]);
                            }
                        }}
                    />

                    <Button onClick={() => {
                        updateIsAdding();
                    }}>
                        Create New Rate
                    </Button>

                    <Button onClick={() => updateIsRating()}>
                        Rate Now
                    </Button>
                </label>
            </Collapse>

            {/* Input New Item Information and Upload Cover */}
            <Collapse in={isAdding === true}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Create A New Album Rating
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="ItemName"
                                        required
                                        fullWidth
                                        id="itemName"
                                        label="Item Name"
                                        placeholder="Enter The Item Name"
                                        autoFocus
                                        value={itemName}
                                        onChange={handleItemNameChanged}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="itemDescription"
                                        label="Item Description"
                                        name="Item Description"
                                        value={itemDesc}
                                        onChange={handleAlbumDescChange}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="itemCoverID"
                                        value={fileId}
                                        placeholder="Enter uploaded file ID"
                                    />
                                </Grid>

                            </Grid>

                            <Stack alignItems={"center"} spacing={1}>


                                {/* <Collapse in={fileId !== undefined}>
                                    <Alert severity={"success"}>FileID: {fileId}</Alert>
                                </Collapse> */}
                                <Collapse in={fileId !== undefined && !isUploaded}>
                                    <Stack mt={5} alignItems="center">
                                        <Typography variant="h6">{file?.name}</Typography>
                                        {/** Preview */}
                                        <CardMedia
                                            image={file ? URL.createObjectURL(file) : undefined}
                                            component={"div"}
                                            style={{ width: 500, height: 500 }}
                                        />
                                    </Stack>
                                </Collapse>

                                <Collapse in={file !== undefined && !isUploaded}>
                                    <Stack direction={"row"}>
                                        <IconButton
                                        >
                                            <Done color="success"
                                                onClick={() => {
                                                    upload();
                                                    setIsUploaded(true);
                                                }}
                                            />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setFile(undefined);
                                                setFileId(undefined);
                                                setIsUploaded(false);
                                            }}
                                        >
                                            <Clear color="error" />
                                        </IconButton>
                                    </Stack>
                                </Collapse>
                            </Stack>
                            <Collapse in={file === undefined}>
                                <label htmlFor="contained-button-file">
                                    <Input
                                        accept="image/*"
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <Button variant="contained" fullWidth sx={{ mt: 3 }} component="span">
                                        Upload
                                    </Button>
                                </label>
                            </Collapse>
                            <Collapse in={isUploaded}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3 }}
                                    onClick={async () => {
                                        if (fileId == undefined) {
                                            window.alert("Please Upload Item Cover Image");
                                            return;
                                        }
                                        else if (itemName == undefined) {
                                            window.alert("Please Input Item Name");
                                            return;
                                        }
                                        else if (itemDesc == undefined) {
                                            window.alert("Please Input Item Description");
                                            return;
                                        }
                                        if (contract) {
                                            try {
                                                await contract.addItem(itemName, itemDesc, fileId);
                                            }
                                            catch (err) {
                                                window.alert("Create New Item Failed");
                                                console.log(err);
                                            }
                                        }
                                        setFile(undefined);
                                        setFileId(undefined);
                                        setIsUploaded(false);
                                        updateIsAdding();
                                        getCreatedItemList();
                                    }}
                                >
                                    Confirm
                                </Button>

                            </Collapse>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 3 }}
                                onClick={() => {
                                    setFile(undefined);
                                    setFileId(undefined);
                                    setIsUploaded(false); updateIsAdding()
                                }}
                            >
                                Cancel
                            </Button>

                        </Box>
                    </Box>
                </Container>
            </Collapse>

            {/* Input Item Address and Go to Detail */}
            <Collapse in={isRating === true}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Go to Item Detials and Rate
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="ItemAddress"
                                        required
                                        fullWidth
                                        id="ItemAddress"
                                        label="Item Address"
                                        placeholder="Enter The Item Address"
                                        value={itemId}
                                        onChange={handleItemIdChanged}
                                        autoFocus
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                onClick={async () => {
                                    updateIsRating();
                                    await router.push("Dashboard?itemId=" + itemId)
                                }}
                            >
                                Confirm
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => {
                                    updateIsRating();
                                }}

                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Collapse>


            {/* Tab Contents */}
            <Collapse in={isAdding === false && isRating === false}>
                <Box sx={{
                    width: '100%',
                    backgroundColor: 'primary.dark',
                }}>
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab label="Owned Items " value="1" />
                                <Tab label="Rated Items" value="2" />
                            </TabList>
                        </Box>
                        {/* Owned By Self */}
                        <TabPanel value="1">
                            <Box sx={{ width: '100%', minWidth: 860, minHeight: 80, bgcolor: 'background.paper' }}>
                                {ownedItems.map((item) => {
                                    const labelId = `checkbox-list-secondary-label-${item.itemId}`;
                                    return (
                                        <Card
                                            sx={{ width: '100%', minwidth: 800, minHeight: 100, marginBottom: 5 }}
                                            key={item.itemId}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={2}>
                                                    <img
                                                        style={{ width: 140, height: 100, marginTop: 1 }}
                                                        src="https://s3.bmp.ovh/imgs/2022/05/05/0ad9a0ed1a3a5f7d.webp"
                                                    >

                                                    </img>
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
                                                                {item.itemName}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>
                                                                {item.itemDescription}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Typography>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>
                                                                Rated: {item.totalCount <= 0 ? 0 : item.totalRating / item.totalCount}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        sx={{ mt: 3, mb: 2, maxWidth: 100 }}
                                                        onClick={async () => {
                                                            const query = qs.stringify({
                                                                itemId: item.itemId
                                                            });
                                                            await router.push("/Dashboard" + "?" + query);
                                                        }}
                                                    >
                                                        Rate
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    );
                                })}
                            </Box>
                        </TabPanel>

                        {/* Participated By Self */}
                        <TabPanel value="2">
                            <Box sx={{ width: '100%', minWidth: 860, minHeight: 80, bgcolor: 'background.paper' }}>
                                {joinedItems.map((item) => {
                                    const labelId = `checkbox-list-secondary-label-${item.itemId}`;
                                    return (
                                        <Card
                                            sx={{ width: '100%', minwidth: 800, minHeight: 100, marginBottom: 5 }}
                                            key={item.itemId}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={2}>
                                                    <img
                                                        style={{ width: 140, height: 100, marginTop: 1 }}
                                                        src="https://s3.bmp.ovh/imgs/2022/05/05/0ad9a0ed1a3a5f7d.webp"
                                                    >

                                                    </img>
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
                                                                {item.itemName}
                                                            </Typography>

                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>
                                                                {item.itemDescription}
                                                            </Typography>

                                                        </Grid>

                                                    </Grid>

                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Typography>
                                                            </Typography>

                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>
                                                            </Typography>

                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>
                                                                Rated: {item.totalCount <= 0 ? 0 : item.totalRating / item.totalCount}
                                                            </Typography>
                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        sx={{ mt: 3, mb: 2, maxWidth: 100 }}
                                                        onClick={
                                                            async () => {
                                                                const query = qs.stringify({
                                                                    itemId: item.itemId,
                                                                });
                                                                await router.push("/Dashboard?" + query);
                                                            }
                                                        }>
                                                        Rate
                                                    </Button>
                                                </Grid>

                                            </Grid>


                                        </Card>
                                    );
                                })}
                            </Box>
                        </TabPanel>
                    </TabContext>


                </Box>

            </Collapse>
        </Stack>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const { walletAddress } = ctx.query;
    const jsonRPC = new json_rpc_methods.JsonRpcMethods(process.env.RPC_URL!);
    const balanceInHex = (await jsonRPC.getBalance(
        walletAddress as string,
        "latest"
    )) as any;
    const balance = parseInt(balanceInHex, 16);

    return {
        props: {
            balance,
            walletAddress: walletAddress as string,
        },
    };
};
