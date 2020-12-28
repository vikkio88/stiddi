import { createStoreon } from 'storeon';
import ui from './modules/ui';
import effects from './modules/effects';
import navigation from './modules/navigation';

const store = createStoreon([
    ui,
    effects,
    navigation
]);


export default store;