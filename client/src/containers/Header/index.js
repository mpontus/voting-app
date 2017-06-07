import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import HeaderComponent from '../../components/Header'
import { makeGetUser } from '../App/selectors';
import { logout } from '../App/actions';

const mapStateToProps = () => {
    const getUser = makeGetUser();

    return createStructuredSelector({
        user: getUser,
    });
};

const enhance = connect(mapStateToProps, { logout });

const Header = ({ user, logout }) => (
    <HeaderComponent
        showLogin={user === null}
        username={user && user.get('name')}
        onLogout={logout}
    />
);

export default enhance(Header);
