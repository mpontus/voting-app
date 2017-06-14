import React from 'react';
import { Card, CardText, Menu, MenuItem } from 'material-ui';
import { Col, Row } from 'react-flexbox-grid';

const Results = ({ title, options, value }) => (
    <Card style={{ marginTop: 6 }}>
        <CardText style={{ paddingRight: 0 }}>
            <Row>
                <Col xs={6}>
                    <h2>{title}</h2>
                </Col>
                <Col xs={6}>
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
                </Col>
            </Row>
        </CardText>
    </Card>
);

export default Results;
