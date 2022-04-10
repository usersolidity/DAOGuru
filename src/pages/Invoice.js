import { Card, TableBody } from "@mui/material";
import {
  Button,
  Container,
  Stack,
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Iconify from "src/components/Iconify";
import { Web3Context } from "src/context/Web3Context";
import { daoToken, factoryAbi, factoryAddress } from "src/contracts/contract";
import CreateInvoiceModal from "src/modal/CreateInvoiceModal";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../components/Page";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

function Invoices() {
  const { Moralis, account, user } = useMoralis();
  const navigate = useNavigate();
  const web3Context = React.useContext(Web3Context);
  const { connectWallet, web3Auth, address } = web3Context;

  const [status, setStatus] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const { fetch, data, error, isLoading } = useMoralisCloudFunction(
    "getInvoices",
    {
      autoFetch: true,
    }
  );

  const [isUpdated, setIsUpdated] = useState([]);
  const [invoices, setInvoices] = useState([]);


  const [ddata, setDData] = useState([]);
  const [tokenid, setTokenid] = useState([]);
  const [uriData, setUriData] = useState([]);
  const [meta, setMeta] = useState([]); 


  const covalent = Moralis.Plugins.covalent;

  async function getInvoiceData() { 
      const ids = [...tokenid];
      const result = await covalent.getNftTokenIdForContract({
          chainId: 80001,
          contractAddress: daoToken,
      })
      const dd = result.data.items && result.data.items.map(async (e) => {
          ids.push(e.token_id);
      })
      setTokenid(ids);
  }

  useEffect(() => {
      Moralis.initPlugins();
      getInvoiceData();
  }, []);

  useEffect(async () => {
      const getUri = [...ddata];
      const tokenUriData = [...uriData];
      const metadata = [...meta];

      for (let index = 0; index < tokenid.length; index++) {
          const element = tokenid[index];
          const res = await covalent.getNftExternalMetadataForContract({
              chainId: 80001,
              contractAddress: daoToken,
              tokenId: element,
          })
          getUri.push(res.data);
      }
      setDData(getUri);

      for (let index = 0; index < getUri.length; index++) {
          const element = getUri[index];
          console.log(element,"element");
          tokenUriData.push(element.items[0].nft_data[0].token_url);
      }

      for (let index = 0; index < tokenUriData.length; index++) {
          const element = tokenUriData[index]; 
          var newStr = element.replace("http://10.128.0.18", "https://ipfs.moralis.io:2053");
          const dd = await axios.get(newStr); 
          metadata.push(dd.data);
      }
      setMeta(metadata);
  }, [tokenid]);





  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setData();
  }, [data, isUpdated, user]);

  async function setData() {
    setLoading(true);
    const invoicedata = await JSON.parse(JSON.stringify(data));
    const d =
      data &&
      invoicedata.filter((inv) => inv.username == user?.attributes.username);
    data && setInvoices(d);
    setLoading(false);
  }

  useEffect(() => {
    fetch();
  }, [isUpdated, user,meta]);

  return (
    <Page title="Agreement |  DAOGuru">
      <CreateInvoiceModal
        open={handleClickOpen}
        close={handleClose}
        op={open}
        acc={address}
        setIsUpdated={setIsUpdated}
        isUpdated={isUpdated}
      />
      <Container pl={0} pr={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4" gutterBottom>
            Invoices
          </Typography>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Invoice
          </Button>
        </Stack>
        <Stack>
          <Card>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
              <TableHead style={{background:'#dc3545',color:'white'}}>
          <TableRow> 
                    <TableCell  style={{color:'white'}}>Invoice Number</TableCell>
                    <TableCell  style={{color:'white'}}>Due Date</TableCell>
                    <TableCell  style={{color:'white'}}>Customer Name</TableCell>
                    <TableCell  style={{color:'white'}}>Price</TableCell>
                    <TableCell  style={{color:'white'}}>Token</TableCell>
                    <TableCell  style={{color:'white'}}>Note</TableCell> 
                    <TableCell  style={{color:'white'}}>Explore</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meta && meta.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                        <h5>No invoices created yet!</h5>
                      </TableCell>
                    </TableRow>
                  )}
                  {meta &&
                    meta.map((invoice) => {
                      console.log(invoice,"invoice");
                      return  ( 
                      <TableRow>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{invoice.name}</TableCell>
                        <TableCell>{invoice.price}</TableCell>
                        <TableCell>{invoice.token}</TableCell>
                        <TableCell>{invoice.note}</TableCell>
                        <TableCell>
                          <Button
                            //   color="primary"
                            size="large"
                            //   type="submit"
                            variant="contained"
                            to={`/invoice/${invoice.invoiceNumber}`}
                            onClick={() => {
                              navigate(`/invoice/${invoice.invoiceNumber}`, {
                                state: invoice,
                              });
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    
                    )})}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export default Invoices;
