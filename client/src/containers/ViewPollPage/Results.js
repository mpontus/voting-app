import React from 'react';
import { Card, CardText, Menu, MenuItem } from 'material-ui';

const Results = ({ title, options, value }) => (
    <Card style={{ marginTop: 6 }}>
        <CardText style={{ paddingRight: 0 }}>
            <h2>{title}</h2>
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
        </CardText>
    </Card>
);

export default Results;
