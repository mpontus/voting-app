import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';

const propTypes = {
    children: PropTypes.node,
};

const Layout = ({ children }) => (
    <div>
        <Header />
        {children}
    </div>
);

Layout.propTypes = propTypes;

export default Layout
