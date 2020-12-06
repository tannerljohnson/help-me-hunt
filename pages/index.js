import React, { useState } from "react";
import Layout from '../components/Layout.js'
import { Button, ListGroup, ListGroupItem, Col, Row, CardBody, CardTitle, CardSubtitle, Card } from "shards-react";

export const BASE_ENDPOINT = 'https://cqiqnxsapf.execute-api.us-west-2.amazonaws.com/Prod';

const fetchSeasons = async () => {
  const res = await fetch(`${BASE_ENDPOINT}/seasons`);
  return await res.json();
};

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <Layout>
      <h1>
        Help me hunt
      </h1>
      <Button onClick={async () => {
        const results = await fetchSeasons();
        setSearchResults(results);
      }}>
        Show all seasons
      </Button>
      <div>
      {!!searchResults.length && (
        searchResults.map(result => (
            <Card key={result.id} style={{ marginTop: '15px' }}>
              <CardBody>
                <CardTitle>{result.species}</CardTitle>
                <CardSubtitle>{result.subspecies ?? 'any'}</CardSubtitle>
                <div>
                  Season: {result.seasonStart} - {result.seasonEnd}
                </div>
                <div>
                  Region ID: {result.regionId}
                </div>
              </CardBody>
            </Card>
          )
        )
      )}
      </div>
    </Layout>
  );
};

export default Home
