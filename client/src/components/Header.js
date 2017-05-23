import React from 'react';
import { Link } from 'react-router-dom';

import {
    Toolbar,
    RaisedButton,
    ToolbarSeparator,
    ToolbarTitle,
    ToolbarGroup,
    DropDownMenu,
    MenuItem,
} from 'material-ui';

import ActionList from 'material-ui/svg-icons/action/list'
import FontIcon from 'material-ui/FontIcon';
import { muiThemeable } from 'material-ui/styles'

function getStyles(muiTheme) {
    console.log(muiTheme);

    const {
        spacing: {
            desktopGutter,
        },
        palette: {
            secondaryTextColor,
        },
    } = muiTheme;

    return {
        toolbar: {
            marginBottom: 24,
        },
        title: {
            paddingRight: 0,
        },
        titleLink: {
            color: secondaryTextColor,
            textDecoration: 'none',
        },
        secondaryButton: {
            marginRight: 0,
        },
    };
}

const Header = ({ muiTheme }) => {
    const styles = getStyles(muiTheme);

    console.log(styles.titleLink);

    return (
        <Toolbar style={styles.toolbar}>
            <ToolbarGroup>
                <ToolbarTitle
                    text={
                        <Link
                            to="/"
                            style={styles.titleLink}
                        >
                            Voting App
                        </Link>
                    }
                    style={styles.title}
                />

                <ToolbarSeparator />

                <RaisedButton
                    primary={true}
                    label="Create a Poll"
                    containerElement={
                        <Link to="/new"/>
                    }
                    icon={<ActionList />}
                />
            </ToolbarGroup>

            <ToolbarGroup>
                <RaisedButton
                    label="Sign In with Password"
                    containerElement={
                        <Link to="/login"/>
                    }
                    icon={<FontIcon className="fa fa-lock"/>}
                    style={styles.secondaryButton}
                />
                <RaisedButton
                    label="Sign In with Github"
                    containerElement={
                        <Link to="/login"/>
                    }
                    icon={<FontIcon className="fa fa-github"/>}
                    style={styles.secondaryButton}
                />
            </ToolbarGroup>
        </Toolbar>
    );
};

export default muiThemeable()(Header);
