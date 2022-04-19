import { json_rpc_methods } from "@etherdata-blockchain/etherdata-sdk";
import {
  Alert,
  Card,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useMetaMask } from "metamask-react";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

export default function Detail() {
  const router = useRouter();
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const { id } = router.query;
  const { data, error } =
    useSWR<json_rpc_methods.GetTransactionByHashResponseObj>(
      `/api/tx/${id}`,
      async (url) => {
        const res = await fetch(url);
        return res.json();
      },
      { refreshInterval: 2000 }
    );

  const { data: balance, error: balanceError } = useSWR(
    account,
    async (account) => {
      const res = await fetch(`/api/balance/${account}`);
      return res.json();
    },
    { refreshInterval: 2000 }
  );

  return (
    <Stack p={5} direction="column" spacing={2}>
      {data === undefined && <LinearProgress />}{" "}
      {error && <Alert severity="error">{JSON.stringify(error)}</Alert>}
      <Typography variant="h4">Transaction</Typography>
      <Stepper activeStep={Boolean(data?.blockHash) ? 3 : 1}>
        <Step>
          <StepLabel>Sent</StepLabel>
        </Step>
        <Step>
          <StepLabel>Pending</StepLabel>
        </Step>
        <Step>
          <StepLabel>Confirmed</StepLabel>
        </Step>
      </Stepper>
      <Grid container spacing={2}>
        <Grid xs={8} p={2}>
          <Card>
            {data && (
              <List>
                {Object.entries(data).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText primary={key} secondary={value} />
                  </ListItem>
                ))}
              </List>
            )}
          </Card>
        </Grid>
        <Grid xs={4} p={2}>
          <Card>
            <List>
              <ListItem>
                <ListItemText
                  primary="Balance"
                  secondary={`${balance?.balance}`}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}