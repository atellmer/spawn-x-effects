'use strict';

const test = require('tape');
const { effects } = require('../lib/spawn-x-effects.umd');


test(`effects don't trows exeption`, (t) => {
  t.doesNotThrow(() => {
    effects();
  });
  t.end();
});

test(`effects call next function`, (t) => {
  let call = false;
  const next = action => call = true;

  effects({})(next)({});

  t.equal(call, true);

  t.end();
});

test(`run method don't trows exeption`, (t) => {
  t.doesNotThrow(() => {
    effects.run(() => {});
  });

  effects.clear();
  t.end();
});

test(`run method trows exeption with empty arguments`, (t) => {
  t.throws(() => {
    effects.run();
  });
  t.end();
});

test(`run method trows exeption with non function arguments`, (t) => {
  t.throws(() => {
    effects.run({});
  });
  t.throws(() => {
    effects.run([]);
  });
  t.throws(() => {
    effects.run(false);
  });

  effects.clear();
  t.end();
});

test(`effects passes store and action into callbacks`, (t) => {
  const store = {
    hello: 'world'
  };
  const action = {
    data: 'foo',
    type: 'BAR'
  };
  const next = action => {};
  const effect = (myStore, myAction) => {
    t.deepEqual(myStore, store);
    t.deepEqual(myAction, action);
  };

  effects.run(effect);
  effects(store)(next)(action);

  effects.clear();
  t.end();
});

test(`effects passes through all callbacks and call them`, (t) => {
  let count = 0;
  const next = action => {};
  const effect = (store, action) => count++;

  effects.run(effect);
  effects.run(effect);
  effects({})(next)({});

  t.equal(count, 2);

  effects.clear();
  t.end();
});
