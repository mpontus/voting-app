import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import MultiInputStory from './MultiInputStory';

storiesOf('MultiInput', module)
    .add('normal behavior', () => (
        <MultiInputStory
            defaultLines={[
                'foo',
                'bar',
            ]}
            onChangeLine={action('changeLine')}
            onAddLine={action('addLine')}
            onRemoveLine={action('removeLine')}
        />
    ));
