import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

const styles = {
    actions: {
        marginTop: 30,
    },
};

const FormLayout = ({ children, actions }) => (
    <div>
        {children}
        {actions && (
            <Row style={styles.actions}>
                <Col xs={12} sm={6} smOffset={6}>
                    {actions}
                </Col>
            </Row>
        )}
    </div>
);

export default FormLayout;
