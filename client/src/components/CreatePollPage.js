import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { TextField } from 'material-ui'
import Autofocus from './Autofocus';

const CreatePollPage = () => (
    <Grid>
        <Row>
            <Col xs={8} xsOffset={2} sm={8} smOffset={2} md={6} mdOffset={3}>
                <Autofocus
                    component={TextField}
                    fullWidth={true}
                    hintText="Enter your question"
                />
            </Col>
        </Row>
    </Grid>
);

export default CreatePollPage;
