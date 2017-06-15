import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import {
    Avatar, Card, CardActions, CardText, CardTitle, FlatButton,
} from 'material-ui';
import KeyboardBackspaceIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
import { Col, Row } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import { grey300 } from 'material-ui/styles/colors';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import VotingForm from '../../components/VotingForm';
import { vote, extend } from './actions';

const enhance = compose(
    connect(null, { vote, extend }),
    withState('value', 'setValue', null),
    withHandlers({
        handleSubmit: ({ id, value, vote, extend }) => () => {
            const { create, option } = value;

            if (create) {
                return extend(id, option);
            }

            return vote(id, option);
        },
    }),
);

const Form = ({ title, options, author, value, setValue, handleSubmit }) => (
    <Card>
        <FlatButton
            label="Back to the List"
            icon={<KeyboardBackspaceIcon style={{ paddingTop: 1 }} />}
            containerElement={<Link to="/" />}
        />
        <Row>
            <Col xs={12} md={6}>
                <CardText style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar src={author.avatar} size={140} style={{ borderStyle: 'solid', borderWidth: 3, borderColor: grey300 }} />
                    <CardTitle title={title} style={{ textAlign: 'center', paddingBottom: 0 }} />
                </CardText>
            </Col>
            <Col xs={12} md={6}>
                <VotingForm
                    options={options}
                    value={value}
                    onChange={setValue}
                />
            </Col>
        </Row>
        <CardActions style={{ textAlign: 'right' }}>
            <FlatButton
                primary
                disabled={!value}
                icon={<CheckCircleIcon/>}
                label="Submit your vote"
                onClick={handleSubmit}
            />
        </CardActions>
    </Card>
);

export default enhance(Form);
