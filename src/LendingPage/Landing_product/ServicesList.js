
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import { styled } from "@mui/material/styles";
import moment from "moment";

const ProductImgStyle = styled("img")({
  top: 0,
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "10px",
});

function ServicesList() {
  const [prod, setProd] = useState([]);
  const { fetch, data, error, isLoading } = useMoralisCloudFunction(
    "getProducts",
    {
      autoFetch: true,
    }
  );

  useEffect(() => {
    setProducts();
  }, [data]);

  async function setProducts() {
    const product = await JSON.parse(JSON.stringify(data));
    const srvc =
      product &&
      product.filter(
        (ser) =>
          "service" == ser.type 
      );
      setProd(srvc);
    setProd(srvc);
  }

  useEffect(() => {
    fetch();
  }, [isLoading]);


  return (
    <div className="container-fluid  mt-5 mb-5">
    <div className="row">
      <div className="col-12  ">
        <p className="network pt-4">All Services</p>
      </div>
    </div>
    <div className="container">
    <div className="row">
      {prod &&
        prod.map((e,i) => { 
            return (
              <div key={e.objectId} className="col-12 col-lg-4 col-md-4">
                <Card  sx={{ border: "1px solid #eee" }}>
                <CardContent>
                  <Box>
                    {e.image && (
                      <ProductImgStyle alt={e.image.name} src={e.image.url} />
                    )}
                  </Box>
                  <Box sx={{ marginTop: "10px" }}>
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {e.title}
                    </Typography>
  
                    <Typography color="textPrimary" gutterBottom variant="body">
                      {e.description}
                    </Typography>
                    <Box sx={{ mt: "15px", mb: "15px" }}>
                      <Typography color="textPrimary" gutterBottom variant="h5">
                        Created by: {e.user.username}
                      </Typography>
                      <Typography color="textPrimary" gutterBottom variant="body">
                        {moment(e.createdAt).format("MMMM Do YYYY")}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              </div>
            );  
        })}
    </div>
    </div>
    <div className="row mt-4">
      <div className="col-12 network">
        {/* <Button  onClick={handleNavigateService} variant="contained">View all Services</Button> */}
      </div>
    </div>
  </div>
  )
}

export default ServicesList