import React from 'react';
import { Avatar, CardText, CardTitle } from 'material-ui';
import { grey300 } from 'material-ui/styles/colors';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        borderStyle: 'solid',
        borderWidth: 3,
        borderColor: grey300,
    },
    title: {
        textAlign: 'center',
        paddingBottom: 0,
    }
};

const PollBanner = ({ avatar, title }) => (
    <CardText style={styles.root}>
        <Avatar
            style={styles.avatar}
            src={avatar}
            size={140}
        />
        <CardTitle
            title={title}
            style={styles.title}
        />
    </CardText>
);

export default PollBanner;
