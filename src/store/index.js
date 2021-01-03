import { createStoreon } from 'storeon';
import ui from './modules/ui';
import effects from './modules/effects';
import navigation from './modules/navigation';
import player from './modules/player';

const store = createStoreon([
    ui,
    effects,
    navigation,
    player
]);


export default store;