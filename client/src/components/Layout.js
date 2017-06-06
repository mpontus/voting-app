import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Header from './Header';

const propTypes = {
    children: PropTypes.node,
};

const Layout = ({ children }) => (
    <div>
        <Header />
        <Grid>
            <Row>
                <Col xs={8} xsOffset={2} sm={8} smOffset={2} md={6} mdOffset={3}>
                    {children}
                </Col>
            </Row>
        </Grid>
    </div>
);

Layout.propTypes = propTypes;

export default Layout
