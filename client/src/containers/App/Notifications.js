import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Notification from '../../components/Notification';
import { makeGetNotifications } from './selectors';
import { notificationDismissed } from './actions';

const mapDispatchToProps = () => {
    const getNotifications = makeGetNotifications();

    return createStructuredSelector({
        messages: getNotifications,
    })
};

const enhance = connect(mapDispatchToProps, { notificationDismissed });

const Notifications = ({ messages, notificationDismissed }) => (
    <div>
        {messages.map(({ id, text }) => (
            <Notification
                key={id}
                message={text}
                onClose={() => notificationDismissed(id)}
                autoHideDuration={3000}
            />
        ))}
    </div>
)

export default enhance(Notifications);
