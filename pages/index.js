import React, { useState } from "react";
import Layout from '../components/Layout.js'
import { Button, FormSelect, Form, FormGroup, FormCheckbox, CardBody, CardTitle, CardSubtitle, Card } from "shards-react";

export const BASE_ENDPOINT = 'https://cqiqnxsapf.execute-api.us-west-2.amazonaws.com/Prod';
export const DEFAULT_STATE = 'Idaho';
export const DEFAULT_SPECIES = 'deer';
export const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// TODO: join in backend based on state, this is only for Idaho
const convertRegion = regionId => {
  const [_stateId, region, subRegion] = regionId.split('-');
  const subRegionIndex = parseInt(subRegion) + 1;
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  const computedSubRegion = subRegionIndex > 0 ? ALPHABET[subRegionIndex - 1].toUpperCase() : '';
  return parseInt(region) + computedSubRegion;
};

const humanReadableDate = dateString => {
  const d = new Date(dateString);
  return d.toDateString();
};

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [stateSelection, setStateSelection] = useState(DEFAULT_STATE);
  const [speciesSelection, setSpeciesSelection] = useState(DEFAULT_SPECIES);
  const [youthOnly, setYouthOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSeasons = async () => {
    setLoading(true);
    const queryParams = `state=${stateSelection}&species=${speciesSelection}&youthOnly=${youthOnly}`;
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
        <FormGroup>
          <FormCheckbox
            id="#youthOnly"
            checked={youthOnly}
            onChange={() => setYouthOnly(!youthOnly)}
          >
            Youth only
          </FormCheckbox>
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
          <div>
            {searchResults.length} results
          </div>
        )}
        {!!searchResults.length && (
          searchResults.map(result => (
              <Card key={result.id} style={{ marginTop: '15px' }}>
                <CardBody>
                  <CardTitle>Region: {convertRegion(result.regionId)}</CardTitle>
                  <CardSubtitle style={{ paddingTop: '8px' }}>
                    {capitalize(result.species)} ({result.subspecies ? capitalize(result.subspecies) : 'Any'})
                  </CardSubtitle>
                  <div>
                    Season: {humanReadableDate(result.seasonStart)} - {humanReadableDate(result.seasonEnd)}
                  </div>
                  <div>
                    Weapon type: {capitalize(result.weaponType)}
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
