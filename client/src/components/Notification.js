import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from 'material-ui';

class Notification extends Component {
    static propTypes = {
        message: PropTypes.node.isRequired,
        animationTimeout: PropTypes.number,
        onClose: PropTypes.func.isRequired,
    };

    static defaultProps = {
        animationTimeout: 1000,
    };

    state = {
        open: false,
    };

    timer = null;

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({ open: true });
        }, 100);
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    handleClose = () => {
        this.setState({ open: false }, () => {
            const { onClose, animationTimeout } = this.props;

            this.timer = setTimeout(onClose, animationTimeout);
        })
    };

    render() {
        const {
            message,
            animationTimeout, // eslint-disable-line no-unused-vars
            onClose, // eslint-disable-line no-unused-vars
            ...rest
        } = this.props;

        return (
            <Snackbar
                {...rest}
                message={message}
                open={this.state.open}
                onActionTouchTap={this.handleClose}
                onRequestClose={this.handleClose}
            />
        )
    }
}

export default Notification;
