import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';
import HeaderComponent from '../../components/Header'
import { makeGetUser } from '../App/selectors';
import { logout, pressLoginButton, closeLoginDialog } from '../App/actions';
import { makeGetLoginShown } from '../App/selectors';

const mapStateToProps = () => {
    const getUser = makeGetUser();
    const getLoginShown = makeGetLoginShown();

    return createStructuredSelector({
        user: getUser,
        loginShown: getLoginShown,
    });
};

const enhance = compose(
    connect(mapStateToProps, { pressLoginButton, closeLoginDialog, logout }),
    withProps(({ user }) => ({ user: user.toJS() })),
);

const Header = ({ user, loginShown, pressLoginButton, closeLoginDialog, logout }) => {
    const isAuthenticated = !user.anonymous;

    return (
        <HeaderComponent
            showLogin={!isAuthenticated && !loginShown}
            showClose={!isAuthenticated && loginShown}
            showMenu={isAuthenticated}
            username={user.name}
            onLogin={pressLoginButton}
            onClose={closeLoginDialog}
            onLogout={logout}
        />
    );
};

export default enhance(Header);
