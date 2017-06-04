import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { getEntities } from '../App/selectors'
import { pollSchema } from '../App/schemas'

export const makeGetPoll = () => createSelector(
    getEntities,
    (_, id) => id,
    (entities, id) => denormalize(id, pollSchema, entities),
);
