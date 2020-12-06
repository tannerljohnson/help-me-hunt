import React, { useState } from "react";
import Layout from '../components/Layout.js'
import { Button, FormSelect, Form, FormGroup, CardBody, CardTitle, CardSubtitle, Card } from "shards-react";

export const BASE_ENDPOINT = 'https://cqiqnxsapf.execute-api.us-west-2.amazonaws.com/Prod';
export const DEFAULT_STATE = 'Idaho';
export const DEFAULT_SPECIES = 'deer';
export const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [stateSelection, setStateSelection] = useState(DEFAULT_STATE);
  const [speciesSelection, setSpeciesSelection] = useState(DEFAULT_SPECIES);
  const [loading, setLoading] = useState(false);

  const fetchSeasons = async () => {
    setLoading(true);
    const queryParams = `state=${stateSelection}&species=${speciesSelection}`;
    const res = await fetch(`${BASE_ENDPOINT}/seasons?${queryParams}`);
    const data = await res.json();
    setLoading(false);
    return data;
  };

  return (
    <Layout>
      <h1>
        Help me hunt
      </h1>
      <Form>
        <FormGroup>
          <label htmlFor="#state">Select state</label>
          <FormSelect id="#state" onChange={e => setStateSelection(e.target.value)}>
            <option value="Idaho">Idaho</option>
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <label htmlFor="#species">Select game</label>
          <FormSelect id="#species" onChange={e => setSpeciesSelection(e.target.value)}>
            <option value="deer">Deer</option>
          </FormSelect>
        </FormGroup>
      </Form>
      <Button disabled={loading} onClick={async () => {
        const results = await fetchSeasons();
        setSearchResults(results);
      }}>
        {loading ? (
          <>
            Loading...
          </>
        ) : (
          <>Find seasons</>
        )}
      </Button>
      <div>
      {!!searchResults.length && (
        searchResults.map((result, i) => (
            <Card key={result.id} style={{ marginTop: '15px' }}>
              <CardBody>
                <CardTitle>{i+1}. {capitalize(result.species)}</CardTitle>
                <CardSubtitle>Allowed types: {result.subspecies ? capitalize(result.subspecies) : 'Any'}</CardSubtitle>
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
