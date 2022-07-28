import React, { Component } from 'react';
import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

const addTweakpane = () => {
  const params = {
    x: 0.005,
    y: 0.0,
    ior: 0.98,
    posX: 0.0,
    posY: -0.2,
    posZ: 0.0,
    scale: 1.0,
  };

  const pane = new Pane({
    title: 'Title',
    container: document.querySelector('#_next'),
  });
  pane.registerPlugin(EssentialsPlugin);

  pane.addInput(params, 'x', {
    min: 0.0,
    max: 0.1,
  });
  pane.addInput(params, 'y', {
    min: 0.0,
    max: 0.1,
  });
  pane.addInput(params, 'ior', {
    min: 0.0,
    max: 10.0,
  });

  pane.addInput(params, 'posX', {
    min: -10.0,
    max: 10.0,
  });
  pane.addInput(params, 'posY', {
    min: -10.0,
    max: 10.0,
  });
  pane.addInput(params, 'posZ', {
    min: -10.0,
    max: 10.0,
  });

  pane.addInput(params, 'scale', {
    min: 0.01,
    max: 10.0,
  });
};

export { addTweakpane };
