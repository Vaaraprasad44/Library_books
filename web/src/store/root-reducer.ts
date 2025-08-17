import { combineReducers } from '@reduxjs/toolkit';

import { reducer as apiReducer, reducerPath } from './api';

export const rootReducer = combineReducers({
  [reducerPath]: apiReducer
});
