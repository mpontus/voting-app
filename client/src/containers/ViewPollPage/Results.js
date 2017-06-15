import React from 'react';
import { Menu, MenuItem } from 'material-ui';
import { Col, Row } from 'react-flexbox-grid';
import PollBanner from '../../components/PollBanner';

const Results = ({ title, options, author, value }) => (
    <div>
        <Row>
            <Col xs={12} md={6}>
                <PollBanner
                    title={title}
                    avatar={author.avatar}
                />
            </Col>
            <Col xs={12} md={6}>
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
    </div>
);

export default Results;
