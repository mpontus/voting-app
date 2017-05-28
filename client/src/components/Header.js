import React from 'react';
import { Link } from 'react-router-dom';

import {
    Toolbar,
    RaisedButton,
    ToolbarSeparator,
    ToolbarTitle,
    ToolbarGroup,
    IconButton,
} from 'material-ui';

import ActionList from 'material-ui/svg-icons/action/list'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FontIcon from 'material-ui/FontIcon';
import { muiThemeable } from 'material-ui/styles'
import MediaQuery from 'react-responsive';

function getStyles(muiTheme) {
    console.log(muiTheme);

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
            paddingLeft: desktopGutter * 2,
            paddingRight: desktopGutter * 2,
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
            marginLeft: 0,
            marginRight: 0,
        },
    };
}

const Header = ({ muiTheme }) => {
    const styles = getStyles(muiTheme);

    return (
        <div>
            <MediaQuery minDeviceWidth={900}>
                <Toolbar style={styles.toolbar}>
                    <ToolbarGroup firstChild={true}>
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
                        <ToolbarTitle
                            text="Sign In"
                        />
                        <RaisedButton
                            containerElement={
                                <Link to="/login"/>
                            }
                            icon={<FontIcon className="fa fa-lock"/>}
                            style={styles.secondaryButton}
                        />
                        <RaisedButton
                            containerElement={
                                <Link to="/login"/>
                            }
                            icon={<FontIcon className="fa fa-github"/>}
                            style={styles.secondaryButton}
                        />
                    </ToolbarGroup>
                </Toolbar>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={900}>
                <Toolbar style={styles.toolbar}>
                    <ToolbarGroup firstChild={true}>
                        <ToolbarTitle
                            text={
                                <div>
                                    <Link
                                        to="/"
                                        style={styles.titleLink}
                                    >
                                        Voting App
                                    </Link>
                                </div>

                            }
                            style={styles.title}
                        />
                    </ToolbarGroup>

                    <ToolbarGroup lastChild={true}>
                        <IconButton
                            containerElement={
                                <Link to="/new"/>
                            }
                        >
                            <ContentAdd />
                        </IconButton>

                        <IconButton
                            disabled
                            containerElement={
                                <Link to="/login"/>
                            }
                            style={styles.secondaryButton}
                        >
                            <FontIcon className="fa fa-github"/>
                        </IconButton>
                        <IconButton
                            containerElement={
                                <Link to="/login"/>
                            }
                            style={styles.secondaryButton}
                        >
                            <FontIcon className="fa fa-lock"/>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
            </MediaQuery>
        </div>
    );
};

export default muiThemeable()(Header);
