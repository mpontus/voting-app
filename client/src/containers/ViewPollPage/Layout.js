import React from 'react';
import { Col, Row } from 'react-flexbox-grid';
import PollBanner from '../../components/PollBanner';
import { CardActions } from 'material-ui';

const Layout = ({ title, avatar, actions, children, ...rest }) => (
    <div {...rest}>
        <Row>
            <Col xs={12} md={6}>
                <PollBanner
                    title={title}
                    avatar={avatar}
                />
            </Col>
            <Col xs={12} md={6}>
                {children}
            </Col>
        </Row>
        {actions && (
            <CardActions style={{ textAlign: 'right' }}>
                {actions}
            </CardActions>
        )}
    </div>
);

export default Layout;
