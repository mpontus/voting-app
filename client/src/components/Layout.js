import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';

const propTypes = {
    children: PropTypes.node,
};

const Layout = ({ header, children }) => (
    <div>
        {header}
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
