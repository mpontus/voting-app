import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { TextField } from 'material-ui';
import { muiThemeable } from 'material-ui/styles';


function getStyles(muiTheme, props) {
    const {
        palette: {
            textColor,
            disabledColor,
            canvasColor,
            borderColor,
        },
        avatar: {
            backgroundColor,
        },
    } = muiTheme;
    const { focused } = props;

    return {
        root: {
            display: 'flex',
            // alignItems: 'center',
            position: 'relative',
        },
        numberContainer: {
            paddingRight: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        number: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 24,
            height: 24,
            background: borderColor,
            color: '#fff',
            verticalAlign: 'bottom',
            userSelect: 'none',
        },
        container: {
            flex: '1',
        },
    }
}

const enhance = compose(
    withState('focused', 'setFocused', false),
    withHandlers({
        onFocus: ({ setFocused }) => () => setFocused(true),
        onBlur:  ({ setFocused }) => () => setFocused(false),
    }),
    muiThemeable(),
);

const OptionInput = enhance((props) => {
    const {
        muiTheme,
        onFocus,
        onBlur,
        number,
        focused, // eslint-disable-line no-unused-vars
        ...rest
    } = props;
    const styles = getStyles(muiTheme, props);

    return (
        <div style={styles.root}>
            <div style={styles.numberContainer}>
                <div style={styles.number}>
                    {number}
                </div>
            </div>
            <div style={styles.container}>
                <TextField
                    fullWidth={true}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    {...rest}
                />
            </div>
        </div>
    )
});

export default OptionInput;
