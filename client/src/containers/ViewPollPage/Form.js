import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { CardActions, FlatButton } from 'material-ui';
import { Col, Row } from 'react-flexbox-grid';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import VotingForm from '../../components/VotingForm';
import { vote, extend } from './actions';
import PollBanner from '../../components/PollBanner';

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
    <div>
        <Row>
            <Col xs={12} md={6}>
                <PollBanner
                    title={title}
                    avatar={author.avatar}
                />
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
    </div>
);

export default enhance(Form);
