import Header from './Header'
import { initGA, logPageView } from '../utils/analytics'
import React, { useEffect } from 'react'
import Head from 'next/head'
import { Card, CardBody, Container, Row, Col } from 'shards-react'

const Layout = props => {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true
    }
    logPageView();
  }, []);

  return (
    <Container className="app-container">
      <Card>
        <CardBody>
          <Head>
            <title>Help Me Hunt</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
            <meta name="description" content="All your hunting questions answered"/>
            <meta property="og:title" content="Help Me Hunt"/>
            <meta property="og:description" content="All things tech security"/>
            <meta property="og:url" content="https://helpmehunt.us"/>
            <meta property="og:type" content="website"/>
          </Head>
          <Header/>
          <Container style={{ marginTop: '25px' }}>
            <Row>
              <Col sm="12" lg="8">
                {props.children}
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Layout