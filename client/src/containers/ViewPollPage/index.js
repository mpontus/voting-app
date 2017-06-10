import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Card, CardActions, CardText, CardTitle, FlatButton, List, ListItem, Menu, MenuItem } from 'material-ui';
import { makeGetPoll } from './selectors';
import { fetchPoll, vote } from './actions';
import ToggleCheckBoxOutlineBlank from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';

const makeMapStateToProps = () => (state, props) => {
    const { id } = props;
    const getPoll = makeGetPoll();

    return {
        poll: getPoll(state, id),
    };
};

const enhance = compose(
    withProps(({ match }) => ({
        id: match.params.id,
    })),
    connect(makeMapStateToProps(), { fetchPoll, vote }),
);

class ViewPollPage extends Component {
    componentDidMount() {
        const { fetchPoll, id } = this.props;

        fetchPoll(id);
    }

    handleVote(option) {
        const { vote, id } = this.props;

        vote(id, option);
    }

    render() {
        const { poll } = this.props;

        if (!poll) {
            return null;
        }

        const { title, options, hasVoted, myVote, tally } = poll.toJS();

        if (hasVoted) {
            return (
                <Card>
                    <CardTitle title={title} />
                    <CardText style={{ paddingRight: 0 }}>
                        <Menu
                            style={{ width: '100%', marginLeft: -16 }}
                        >
                            {options.map((option) => (
                                <MenuItem
                                    key={option}
                                    checked={option === myVote}
                                    insetChildren={true}
                                    primaryText={option}
                                />
                            ))}
                        </Menu>
                    </CardText>
                    <CardActions style={{ textAlign: 'right' }}>
                        <FlatButton label="Results" />
                    </CardActions>
                </Card>
            )
        }

        return (
            <Card>
                <CardTitle title={title} />
                <CardText style={{ paddingRight: 0 }}>
                    <Menu
                        style={{ width: '100%', marginLeft: -16 }}
                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                leftIcon={<ToggleCheckBoxOutlineBlank />}
                                primaryText={option}
                                onClick={() => this.handleVote(option)}
                            />
                        ))}
                    </Menu>
                </CardText>
                <CardActions style={{ textAlign: 'right' }}>
                    <FlatButton label="Results" />
                </CardActions>
            </Card>
        )
    }
}
export default enhance(ViewPollPage);
