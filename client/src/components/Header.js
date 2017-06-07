import React from 'react';
import { Link } from 'react-router-dom';

import {
    AppBar,
    IconMenu,
    MenuItem,
    Toolbar,
    FlatButton,
    RaisedButton,
    ToolbarSeparator,
    ToolbarTitle,
    ToolbarGroup,
    IconButton,
} from 'material-ui';

import ActionList from 'material-ui/svg-icons/action/list'
import ContentAdd from 'material-ui/svg-icons/content/add'
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert'
import FontIcon from 'material-ui/FontIcon';
import { muiThemeable } from 'material-ui/styles'
import MediaQuery from 'react-responsive';

function getStyles(muiTheme) {
    const {
        palette: {
            secondaryTextColor,
        },
        spacing: {
            desktopGutter,
        },
    } = muiTheme;

    return {
        toolbar: {
            paddingLeft: desktopGutter,
            paddingRight: desktopGutter,
            marginBottom: 24,
        },
        title: {
            paddingRight: 0,
            paddingLeft: desktopGutter,
        },
        titleLink: {
            color: secondaryTextColor,
            textDecoration: 'none',
        },
        secondaryButton: {
            marginLeft: 0,
            marginRight: 0,
        },
    };
}

const Header = ({ muiTheme, showLogin, username, onLogout }) => {
    const styles = getStyles(muiTheme);

    return (
        <AppBar
            title="Voting App"
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
};

export default muiThemeable()(Header);
