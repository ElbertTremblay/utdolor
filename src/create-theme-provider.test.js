import test from 'ava';
import React, { Component } from 'react';
import { mount } from 'enzyme';
import browserEnv from 'browser-env';

import isFunction from 'is-function';
import createThemeProvider from './create-theme-provider';
import channel from './channel';
import { getChannel, Trap, Pure, getInterceptor } from './test-helpers';

browserEnv(['window', 'document', 'navigator']);

test(`createThemeProvider's type`, t => {
  const actual = isFunction(createThemeProvider);
  t.true(actual, `createThemeProvider should be a function`);
});

test(`createThemeProvider's result instance type`, t => {
  const ThemeProvider = createThemeProvider();
  const actual = Component.isPrototypeOf(ThemeProvider);
  t.true(actual, `createThemeProvider() should be a React Component`);
});

test(`ThemeProvider default channel`, t => {
  const ThemeProvider = createThemeProvider();
  const actual = getChannel(ThemeProvider);
  const expected = channel;
  t.is(actual, expected, `createThemeProvider() should have default channel`);
});

test(`ThemeProvider custom channel`, t => {
  const custom = '__CUSTOM__';
  const ThemeProvider = createThemeProvider(custom);
  const actual = getChannel(ThemeProvider);
  const expected = custom;
  t.is(
    actual,
    expected,
    `createThemeProvider() should have custom channel if one is provided`,
  );
});

test(`ThemeProvider passes theme`, t => {
  const ThemeProvider = createThemeProvider();
  const theme = { themed: true };
  const actual = getInterceptor();
  const expected = theme;

  mount(
    <ThemeProvider theme={theme}>
      <Trap.Context intercept={actual} />
    </ThemeProvider>,
  );

  t.deepEqual(actual(), expected, `ThemeProvider should pass a theme`);
});

test(`ThemeProvider passes theme deep into tree`, t => {
  const ThemeProvider = createThemeProvider();
  const theme = { themed: true };
  const actual = getInterceptor();
  const expected = theme;

  mount(
    <ThemeProvider theme={theme}>
      <div>
        <div>
          <Trap.Context intercept={actual} />
        </div>
      </div>
    </ThemeProvider>,
  );

  t.deepEqual(
    actual(),
    expected,
    `ThemeProvider should pass a theme deep down into tree`,
  );
});

test(`ThemeProvider passes theme through PureComponent`, t => {
  const ThemeProvider = createThemeProvider();
  const theme = { themed: true };
  const actual = getInterceptor();
  const expected = theme;

  mount(
    <ThemeProvider theme={expected}>
      <Pure>
        <Trap.Context intercept={actual} />
      </Pure>
    </ThemeProvider>,
  );

  t.deepEqual(
    actual(),
    expected,
    `ThemeProvider should pass a theme through PureComponent`,
  );
});

test(`ThemeProvider themes objects merging`, t => {
  const ThemeProvider = createThemeProvider();
  const theme = { themed: true };
  const patch = { merged: true };
  const actual = getInterceptor();
  const expected = { themed: true, merged: true };

  mount(
    <ThemeProvider theme={theme}>
      <ThemeProvider theme={patch}>
        <Trap.Context intercept={actual} />
      </ThemeProvider>
    </ThemeProvider>,
  );

  t.deepEqual(actual(), expected, `ThemeProvider should merge themes`);
});

test(`ThemeProvider theme augmenting`, t => {
  const ThemeProvider = createThemeProvider();
  const theme = { themed: true };
  const augment = outerTheme =>
    Object.assign({}, outerTheme, { augmented: true });
  const actual = getInterceptor();
  const expected = { themed: true, augmented: true };

  mount(
    <ThemeProvider theme={theme}>
      <ThemeProvider theme={augment}>
        <Trap.Context intercept={actual} />
      </ThemeProvider>
    </ThemeProvider>,
  );

  t.deepEqual(actual(), expected, `ThemeProvider should augmented theme`);
});

test(`ThemeProvider propagates theme updates`, t => {
  const ThemeProvider = createThemeProvider();
  const theme = { themed: true };
  const update = { updated: true };
  const actual = getInterceptor();
  const expected = update;

  const wrapper = mount(
    <ThemeProvider theme={theme}>
      <Trap.Context intercept={actual} />
    </ThemeProvider>,
  );

  wrapper.setProps({ theme: expected });

  t.deepEqual(actual(), expected, `ThemeProvider should pass theme update`);
});

test('ThemeProvider propagates theme updates even through PureComponent', t => {
  const ThemeProvider = createThemeProvider();
  const theme = { themed: true };
  const update = { updated: true };
  const actual = getInterceptor();
  const expected = update;

  const wrapper = mount(
    <ThemeProvider theme={theme}>
      <Pure>
        <Trap.Context intercept={actual} />
      </Pure>
    </ThemeProvider>,
  );

  wrapper.setProps({ theme: expected });

  t.deepEqual(
    actual(),
    expected,
    `ThemeProvider should pass theme update even through PureComponent`,
  );
});
