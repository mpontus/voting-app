import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PersonIcon from 'material-ui/svg-icons/social/person';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AddIcon from 'material-ui/svg-icons/av/playlist-add';
import { grey400 } from 'material-ui/styles/colors';

import {
    makeGetPolls,
    makeGetFetching,
} from './selectors';

import { homePageVisitted } from './actions';
import {
    Avatar, Card, CardText, Divider, FlatButton, IconButton, IconMenu, List, ListItem, MenuItem, RaisedButton,
    Subheader,
    TextField,
} from 'material-ui';

const propTypes = {
    homePageVisitted: PropTypes.func.isRequired,
    fetching: PropTypes.bool.isRequired,
    polls: PropTypes.array,
};

const defaultProps = {
    polls: null,
};

class HomePage extends Component {
    componentDidMount() {
        this.props.homePageVisitted();
    }

    render() {
        const { fetching, polls } = this.props;

        if (fetching && !polls) {
            return <div>Loading ....</div>;
        }

        return (
            <div>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Subheader inset style={{ width: 'auto', flex: '1' }}>Recent polls</Subheader>
                        <div>
                            <FlatButton
                                secondary
                                label="Create New Poll"
                                icon={<AddIcon/>}
                                containerElement={<Link to="/new" />}
                            />
                        </div>
                    </div>
                    <List>
                        {polls.map((poll) => {
                            const { id, title, author } = poll.toJS();
                            const avatar = author.anonymous ? (
                                <Avatar icon={<PersonIcon />} />
                            ) : (
                                <Avatar src={author.avatar} />
                            );
                            const username = author.anonymous ? 'Anonymous' : author.username;
                            const iconButtonElement = (
                                <IconButton
                                    touch={true}
                                    tooltip="more"
                                    tooltipPosition="bottom-left"
                                >
                                    <MoreVertIcon color={grey400} />
                                </IconButton>
                            );

                            const rightIconMenu = (
                                <IconMenu iconButtonElement={iconButtonElement}>
                                    <MenuItem>Reply</MenuItem>
                                    <MenuItem>Forward</MenuItem>
                                    <MenuItem>Delete</MenuItem>
                                </IconMenu>
                            );

                            return (
                                <ListItem
                                    key={id}
                                    containerElement={<Link to={`/poll/${id}`}/>}
                                    leftAvatar={avatar}
                                    rightIconButton={rightIconMenu}
                                    primaryText={poll.get('title')}
                                    secondaryText={`By ${username}`}
                                />
                            );
                        })}
                    </List>
                </Card>
            </div>
        )
    }
}

HomePage.propTypes = propTypes;
HomePage.defaultProps = defaultProps;

const makeMapStateToProps = () => {
    const getPolls = makeGetPolls();
    const getFetching = makeGetFetching();

    return createStructuredSelector({
        polls: getPolls,
        fetching: getFetching,
    });
};

const mapDispatchToProps = {
    homePageVisitted,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(HomePage);
