import React from 'react';
import { Menu, MenuItem } from 'material-ui';
import Layout from './Layout';

const Results = ({ title, options, author, value }) => (
    <Layout
        title={title}
        avatar={author.avatar}
        style={{ paddingBottom: 16 }}
    >
        <Menu
            style={{ width: '100%', marginLeft: -16 }}
        >
            {options.map((option) => (
                <MenuItem
                    key={option}
                    checked={option === value}
                    insetChildren={true}
                    primaryText={option}
                />
            ))}
        </Menu>
    </Layout>
);

export default Results;
