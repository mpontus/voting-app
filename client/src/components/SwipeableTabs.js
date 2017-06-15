import React, { Children } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Tabs } from 'material-ui';
import SwipeableViews from 'react-swipeable-views';

const enhance = compose(
    withState('selectedIndex', 'setIndex', 0),
    withHandlers({
        handleChange: ({ setIndex }) => (value) => setIndex(value),
    }),
);

const SwipeableTabs = ({
    children,
    selectedIndex,
    handleChange,
    setIndex, // eslint-disable-line no-unused-vars
    ...rest
}) => {
    const views = Children.map(children, (tab) =>
        <div>{tab.props.children}</div>
    );
    const tabs = Children.map(children, (tab, index) =>
        React.cloneElement(tab, {
            value: index,
        }, null)
    );

    return (
        <div>
            <Tabs
                value={selectedIndex}
                onChange={handleChange}
            >
                {tabs}
            </Tabs>
            <SwipeableViews
                {...rest}
                index={selectedIndex}
                onChangeIndex={handleChange}
            >
                {views.map((view, index) => (
                    <div key={index}>{view}</div>
                ))}
            </SwipeableViews>
        </div>
    )
};

export default enhance(SwipeableTabs);
