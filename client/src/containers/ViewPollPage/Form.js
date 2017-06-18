import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { FlatButton } from 'material-ui';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import VotingForm from '../../components/VotingForm';
import { vote, extend } from './actions';
import Layout from './Layout';

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

const Form = ({ user, title, options, author, value, setValue, handleSubmit }) => (
    <Layout
        title={title}
        avatar={author.avatar}
        actions={
            <FlatButton
                primary
                disabled={!value}
                icon={<CheckCircleIcon/>}
                label="Submit your vote"
                onClick={handleSubmit}
            />
        }
    >
        <VotingForm
            options={options}
            value={value}
            onChange={setValue}
            customOptionEnabled={!user.anonymous}
        />
    </Layout>
);

export default enhance(Form);
