import React from 'react';
import { PropTypes } from 'prop-types';
import PollPage from 'containers/PollPage/index';

export const PollRoute = ({ match }) => (
    <PollPage id={match.params.id}/>
);

export default PollRoute;
