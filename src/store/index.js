import { createStoreon } from 'storeon';
import ui from './modules/ui';
import effects from './modules/effects';

const store = createStoreon([ui, effects]);


export default store;