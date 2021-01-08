import { createStoreon } from 'storeon';
import ui from './modules/ui';
import effects from './modules/effects';
import navigation from './modules/navigation';
import player from './modules/player';
import maps from './modules/maps';

const store = createStoreon([
    ui,
    effects,
    navigation,
    player,
    maps
]);


export default store;