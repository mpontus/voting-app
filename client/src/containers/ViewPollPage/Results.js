import React from 'react';
import { CardText, FontIcon, Menu, MenuItem } from 'material-ui';
import Layout from './Layout';
import { Cell, Pie, PieChart } from 'recharts';
import { Col, Row } from 'react-flexbox-grid';

const COLORS = ["#e96c6f",
    "#6bd158",
    "#d76bd2",
    "#ccd43f",
    "#9198dd",
    "#d69144",
    "#63cdab",
    "#b1be6c"];

const Results = ({ title, options, author, value, tally }) => {
    const data = options.map((option, index) => ({
        name: option,
        value: tally[option],
        color: COLORS[index % COLORS.length],
    }));

    return (
        <Layout
            title={title}
            avatar={author.avatar}
            style={{ paddingBottom: 36 }}
        >
            <CardText>
                <Row style={{ alignItems: 'center' }}>
                    <Col xs={12} sm={6}>
                        <Row center="xs">
                            <Col>
                                <PieChart width={230} height={230}>
                                    <Pie data={data} outerRadius="100%">
                                        {data.map(({ color }) => (
                                            <Cell fill={color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={6}>
                        {data.map(({ name, color }) => (
                            <div style={{ marginTop: 4 }}>
                                <FontIcon className="fa fa-square" style={{ color, verticalAlign: 'top' }} />
                                <span style={{ lineHeight: 1.6, marginLeft: 5 }}>{name}</span>
                            </div>
                        ))}
                    </Col>
                </Row>
            </CardText>
        </Layout>
    );
};

export default Results;
