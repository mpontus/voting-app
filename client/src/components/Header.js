import React from 'react';
import { cond, prop } from 'ramda';
import { Link } from 'react-router-dom';
import {
    AppBar,
    IconMenu,
    MenuItem,
    FlatButton,
    IconButton,
} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import CloseIcon from 'material-ui/svg-icons/navigation/more-vert'
import FontIcon from 'material-ui/FontIcon';
import { muiThemeable } from 'material-ui/styles'
import { withRouter } from 'react-router';
import { compose } from 'recompose';

const styles = {
    title: {
        cursor: 'pointer',
    },
};

const enhance = compose(
    muiThemeable(),
    withRouter,
);

const Header = (props) => {
    const { showLogin, showClose, showMenu, onLogin, onClose, onLogout, history } = props;

    const loginElement = (
        <FlatButton
            icon={<FontIcon className="fa fa-sign-in"/>}
            label="Log in"
            onTouchTap={onLogin}
        />
    );

    const closeElement = (
        <IconButton onClick={onClose}>
            <CloseIcon />
        </IconButton>
    );

    const menuElement = (
        <IconMenu
            iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
            <MenuItem primaryText="Refresh"/>
            <MenuItem primaryText="Help"/>
            <MenuItem
                primaryText="Sign out"
                onTouchTap={onLogout}
            />
        </IconMenu>
    );

    let elementRight = null;
    if (showLogin) {
        elementRight = loginElement;
    } else if (showClose) {
        elementRight = closeElement;
    } else if (showMenu) {
        elementRight = menuElement;
    }

    return (
        <AppBar
            title={<span style={styles.title}>Voting App</span>}
            onTitleTouchTap={() => history.push('/')}
            showMenuIconButton={false}
            iconElementRight={elementRight}
        />
    );
};

export default enhance(Header);
