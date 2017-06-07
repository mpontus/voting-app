import React from 'react';
import { compose, withReducer, withProps, withHandlers } from 'recompose'
import { Row, Col } from 'react-flexbox-grid';
import { RaisedButton, TextField } from 'material-ui'
import Autofocus from '../../components/Autofocus';
import OptionInput from '../../components/OptionInput';
import MultiInput from '../../components/MultiInput/index';
import reducer, { initialState } from './reducer';
import { changeTitle, changeOption, addOption, removeOption } from './actions';

const styles = {
    actions: {
        marginTop: 30,
    },
};

const enhance = compose(
    withReducer('state', 'dispatch', reducer, initialState),
    // TODO: Refactor
    withProps(({ dispatch }) => ({
        changeTitle: (value) => dispatch(changeTitle(value)),
        changeOption: (index, value) => dispatch(changeOption(index, value)),
        addOption: () => dispatch(addOption()),
        removeOption: (index) => dispatch(removeOption(index)),
    })),
    withHandlers({
        handleSubmit: ({ onSubmit, state }) => (event) => {
            const { title, options } = state.toJS();
            event.preventDefault();
            onSubmit({ title, options });
        },
    }),
);

const renderRow = ({ index, ...input }) => {
    return (
        <OptionInput
            number={index + 1}
            name={`options[${index}]`}
            {...input}
        />
    );
};

const CreatePollForm = ({ state, changeTitle, changeOption, addOption, removeOption, handleSubmit }) => (
    <form onSubmit={handleSubmit}>
        <Autofocus
            component={TextField}
            fullWidth={true}
            hintText="Ask your question"
            value={state.get('title')}
            onChange={(event) => changeTitle(event.target.value)}
        />
        <MultiInput
            lines={state.get('options').toJS()}
            minLines={2}
            onAddLine={addOption}
            onRemoveLine={removeOption}
            onChangeLine={changeOption}
            rowComponent={renderRow}
        />
        <Row style={styles.actions}>
            <Col xs={12} sm={6} smOffset={6}>
                <RaisedButton
                    label="Create Poll"
                    fullWidth={true}
                    type="submit"
                />
            </Col>
        </Row>
    </form>
);

export default enhance(CreatePollForm);
