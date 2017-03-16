# spawn-x-effects
### Interceptor (middleware) for [spawn-x](https://github.com/atellmer/spawn-x).

Effects is a small interceptor that enables make cascading state updates, when one action initialize many other actions.


## install
With npm:
```
npm install spawn-x spawn-x-effects --save
```
With yarn:
```
yarn add spawn-x spawn-x-effects
```
With bower:
```
bower install spawn-x spawn-x-effects --save
```
```html
<script src="path/to/spawn-x/lib/spawn-x.umd.min.js"></script>
<script src="path/to/spawn-x-effects/lib/spawn-x-effects.umd.min.js"></script>
```

## Usage

#### app/store/index.js
```javascript
import { createStore, addInterceptor } from 'spawn-x';
import { effects } from 'spawn-x-effects';

import { logger } from '../interceptors/logger';
import { tracksEffect } from '../effects/tracks';
import { renderEffect } from '../effects/render';

const initialState = {
  tracks: [
    'Puddle Of Mudd - Control',
    'American Hi-Fi - Flavor Of The Weak',
    'SR-71 - What A Mess'
  ]
}

//inject effects interceptor 
const store = createStore(
  initialState,
  addInterceptor(logger, effects)
);

//add effect into effects interceptor
effects.run(tracksEffect);
effects.run(renderEffect);

export {
  store
}

```

### Effect is just a function which accept store and action and then updates state
#### app/effects/tracks.js
```javascript
import {
  ADD_TRACK,
  UPDATE_STORE_INIT,
  UPDATE_STORE,
  UPDATE_STORE_COMPLETE,
  NEED_RENDER
} from '../constants';


const tracksEffect = (store, action) => {
  switch (action.type) {
    case ADD_TRACK: {
      store.update('', {
        type: UPDATE_STORE_INIT,
        data: null
      });
      store.update('tracks', {
        type: UPDATE_STORE,
        data: store.select('tracks') ? store.select('tracks').concat(action.data) : [].concat(action.data)
      });
      store.update('', {
        type: UPDATE_STORE_COMPLETE,
        data: null
      });
      store.update('', {
        type: NEED_RENDER,
        data: {
          render: store.select('tracks')
        }
      });
      break;
    }
  }
}

export {
  tracksEffect
}
```

#### app/effects/render.js
```javascript
import {
  NEED_RENDER,
  RENDER_INIT,
  RENDER_COMPLETE
} from '../constants';

import { render } from '../methods/render';


const renderEffect = (store, action) => {
  switch (action.type) {
    case NEED_RENDER: {
      store.update('', {
        type: RENDER_INIT,
        data: null
      });

      render(action.data.render);

      store.update('', {
        type: RENDER_COMPLETE,
        data: null
      });
      break;
    }
  }
}

export {
  renderEffect
}
```

#### app/actions/tracks.js
```javascript
import { store } from '../store';
import { ADD_TRACK } from '../constants';


const addTrack = data => {
  store.update('', {
    type: ADD_TRACK,
    data: data
  });
}

export {
  addTrack
}

```

### And other files...
#### app/constants/index.js
```javascript
export const ADD_TRACK = 'ADD_TRACK';
export const UPDATE_STORE_INIT = 'UPDATE_STORE_INIT';
export const UPDATE_STORE = 'UPDATE_STORE';
export const UPDATE_STORE_COMPLETE = 'UPDATE_STORE_COMPLETE';
export const NEED_RENDER = 'NEED_RENDER';
export const RENDER_INIT = 'RENDER_INIT';
export const RENDER_COMPLETE = 'RENDER_COMPLETE';
```

#### app/methods/render.js
```javascript
const render = tracks => {
  const list = document.querySelector('#trackList');

  list.innerHTML = '';

  if (tracks === null) tracks = [];

  tracks.forEach(item => {
    const li = document.createElement('li');

    li.textContent = item;
    list.appendChild(li);
  });
}

export {
  render
}

```
#### app/interceptors/logger.js
```javascript
function logger(store) {
  return next => action => {
    console.log('action: ', action.type + ': ', JSON.parse(JSON.stringify(action.data)));
    next(action);
  }
}

export {
  logger
}
```

#### app/index.js
```javascript
import '../index.html';
import { store } from './store';
import { render } from './methods/render';
import { addTrack } from './actions/tracks';


const btn = document.querySelector('#addTrack');
const input = document.querySelector('#input');

btn.addEventListener('click', () => {
  addTrack(input.value);
  input.value = '';
});

render(store.select('tracks'));
```

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App</title>
</head>
<body>
  <input type="text" id="input">
  <button id="addTrack">Add track</button>
  <ul id="trackList"></ul>

  <script src="dist/app.bundle.js"></script>
</body>
</html>
```


## LICENSE

MIT © [Alex Plex](https://github.com/atellmer)