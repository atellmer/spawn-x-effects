import {
  isFunc,
  error
} from './helpers';


function effects(store) {
  const cascade = (store, action) => effects.list.forEach(fn => fn(store, action));

  return next => action => {
    cascade(store, action);
    next(action);
  }
}

effects.list = [];

effects.run = effect => {
  if (!isFunc(effect)) return error (`spawn-x-effects: effect must be a function!`);

  effects.list.push(effect);
}

export {
  effects
}
