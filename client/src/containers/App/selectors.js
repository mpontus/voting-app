import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { nthArg } from 'lodash/fp';
import { pollSchema } from './schemas';

const getProps = nthArg(1);

export const getGlobal = state => state.get('global');

export const getEntities = createSelector(
    getGlobal,
    state => state.get('entities')
);

export const makeGetPoll = () => createSelector(
    [getEntities, getProps],
    (entities, props) => {
        const { id } = props;

        return denormalize(id, pollSchema, entities);
    }
);
