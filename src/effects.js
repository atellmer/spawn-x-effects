import {
  isFunc,
  error
} from './helpers';

let listEffects = [];

function effects(store) {
  const cascade = (store, action) => listEffects.forEach(fn => fn(store, action));

  return next => action => {
    cascade(store, action);
    next(action);
  }
}

effects.run = effect => {
  if (!isFunc(effect)) return error (`spawn-x-effects: effect must be a function!`);

  listEffects.push(effect);
}

effects.clear = () => {
  listEffects = [];
}

export {
  effects
}
