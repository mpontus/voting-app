import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { RaisedButton, TextField } from 'material-ui'
import Autofocus from './Autofocus';
import OptionInput from './OptionInput';
import MultiInput from './MultiInput';

const styles = {
    actions: {
        marginTop: 30,
    },
};

const CreatePollPage = () => (
    <Grid>
        <Row>
            <Col xs={8} xsOffset={2} sm={8} smOffset={2} md={6} mdOffset={3}>
                <Autofocus
                    component={TextField}
                    fullWidth={true}
                    hintText="Enter your question"
                />
                <MultiInput
                    lines={['foo', 'bar']}
                    onAddLine={() => {}}
                    onRemoveLine={() => {}}
                    onChangeLine={() => {}}
                    renderRow={({ index, input }) => (
                        <OptionInput
                            number={index + 1}
                            {...input}
                        />
                    )}
                />
                <Row style={styles.actions}>
                    <Col xs={4} xsOffset={8}>
                        <RaisedButton
                            label="Create Poll"
                            fullWidth={true}
                        />
                    </Col>
                </Row>

            </Col>
        </Row>
    </Grid>
);

export default CreatePollPage;
