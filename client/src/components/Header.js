import React from 'react';
import { Link } from 'react-router-dom';

import {
    AppBar,
    IconMenu,
    MenuItem,
    FlatButton,
    IconButton,
} from 'material-ui';

import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert'
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

const Header = ({ muiTheme, showLogin, username, onLogout, history }) => (
    <AppBar
        title={<span style={styles.title}>Voting App</span>}
        onTitleTouchTap={() => history.push('/')}
        showMenuIconButton={false}
        iconElementRight={
            showLogin ? (
                <FlatButton
                    containerElement={<Link to="/login"/>}
                    icon={<FontIcon className="fa fa-sign-in"/>}
                    label="Log in"
                />
            ) : (
                <IconMenu
                    iconButtonElement={
                        <IconButton><NavigationMoreVert /></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    <MenuItem primaryText="Refresh" />
                    <MenuItem primaryText="Help" />
                    <MenuItem
                        primaryText="Sign out"
                        onTouchTap={onLogout}
                    />
                </IconMenu>
            )
        }
    />
);

export default enhance(Header);
