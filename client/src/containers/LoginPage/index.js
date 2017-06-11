import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router'
import LoginForm from '../LoginForm';
import RegistrationForm from '../RegistrationForm'
import { login } from './actions';
import { registerUser } from '../RegistrationPage/actions'
import { Tabs, Tab, Card, CardText, CardActions, FontIcon, FlatButton } from 'material-ui';
import { submit } from 'redux-form';
import SwipeableViews from 'react-swipeable-views';
import SwipeableTabs from '../../components/SwipeableTabs';

const enhance = compose(
    connect(null, { login, registerUser, submit }),
    withRouter,
    withHandlers({
        handleSubmit: ({ login, history: { push } }) => async (values) => {
            const { username, password } = values.toJS();

            try {
                await login({ username, password });
            } catch (error) {
                return;
            }

            push('/');

            return Promise.resolve();
        },
        handleRegister: ({ registerUser, history: { push } }) => ({ username, password }) => {
            registerUser({ username, password }).then(() => {
                push('/');
            }).catch(() => {});
        }
    })
);


const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
};

const LoginPage = ({ handleSubmit, handleRegister, submit }) => (
    <Card>
        <SwipeableTabs
            animateHeight
            enableMouseEvents
        >
            <Tab
                icon={<FontIcon className="fa fa-user-circle-o"/>}
                label="Log In"
            >
                <CardText>
                    <LoginForm onSubmit={handleSubmit}/>
                </CardText>
                <CardActions style={{ textAlign: 'right' }}>
                    <FlatButton
                        primary
                        icon={<FontIcon className="fa fa-sign-in"/>}
                        label="Enter the Voting App"
                        onClick={() => submit('login')}
                    />
                </CardActions>
            </Tab>
            <Tab
                icon={<FontIcon className="fa fa-user-plus"/>}
                label="Register"
            >
                <CardText>
                    <RegistrationForm onSubmit={handleRegister} />
                </CardText>
                <CardActions style={{ textAlign: 'right' }}>
                    <FlatButton
                        primary
                        icon={<FontIcon className="fa fa-sign-in"/>}
                        label="Create New Account"
                        onClick={() => submit('registration')}
                    />
                </CardActions>
            </Tab>
        </SwipeableTabs>
    </Card>
);

class TabsExampleSwipeable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
    }

    handleChange = (value) => {
        this.setState({
            slideIndex: value,
        });
    };

    render() {
        const { handleSubmit, handleRegister, submit } = this.props;

        return (
            <Card>
                <Tabs
                    onChange={this.handleChange}
                    value={this.state.slideIndex}
                >
                    <Tab
                        icon={<FontIcon className="fa fa-user-circle-o"/>}
                        label="Log In"
                        value={0}
                    />
                    <Tab
                        icon={<FontIcon className="fa fa-user-circle"/>}
                        label="Register"
                        value={1}
                    />
                </Tabs>
                <SwipeableViews
                    index={this.state.slideIndex}
                    onChangeIndex={this.handleChange}
                >
                    <div>
                        <CardText>
                            <LoginForm onSubmit={handleSubmit}/>
                        </CardText>
                        <CardActions style={{ textAlign: 'right' }}>
                            <FlatButton
                                primary
                                icon={<FontIcon className="fa fa-sign-in"/>}
                                label="Enter the Voting App"
                                onClick={() => submit('login')}
                            />
                        </CardActions>
                    </div>
                    <div>
                        <CardText>
                            <RegistrationForm onSubmit={handleRegister} />
                        </CardText>
                        <CardActions style={{ textAlign: 'right' }}>
                            <FlatButton
                                primary
                                icon={<FontIcon className="fa fa-sign-in"/>}
                                label="Create New Account"
                                onClick={() => submit('registration')}
                            />
                        </CardActions>
                    </div>
                </SwipeableViews>
            </Card>
        );
    }
}


export default enhance(LoginPage);
// export default enhance(TabsExampleSwipeable);

