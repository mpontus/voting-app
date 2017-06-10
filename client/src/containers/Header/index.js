import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';
import HeaderComponent from '../../components/Header'
import { makeGetUser } from '../App/selectors';
import { logout } from '../App/actions';

const mapStateToProps = () => {
    const getUser = makeGetUser();

    return createStructuredSelector({
        user: getUser,
    });
};

const enhance = compose(
    connect(mapStateToProps, { logout }),
    withProps(({ user }) => ({ user: user.toJS() })),
);

const Header = ({ user, logout }) => {
    return (
        <HeaderComponent
            showLogin={user.anonymous}
            username={user.name}
            onLogout={logout}
        />
    );
};

export default enhance(Header);
