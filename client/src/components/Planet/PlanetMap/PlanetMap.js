import React from 'react';
import { Application } from 'pixi.js';
import { arrayOf, shape, func } from 'prop-types';

import tile from './tile';
// import { Stage, Sprite } from '@inlet/react-pixi';

const PlanetMap = ({ tiles, setSelectedBuildingId }) => {
  const app = new Application({ with: 600, height: 600, transparent: false });
  let containerRef = null;

  const onTileClick = id => {
    const { buildingId } = tiles.find(item => item.id === id);
    setSelectedBuildingId(buildingId);
  };

  // const initialize = () => {};

  const setup = () => {
    tiles.forEach(item => tile({ app, ...item, onClick: onTileClick }));
  };

  const updateContainer = element => {
    // the element is the DOM object that we will use as container to add pixi stage(canvas)
    containerRef = element;
    // now we are adding the application to the DOM element which we got from the Ref.
    if (containerRef && containerRef.children.length <= 0) {
      containerRef.appendChild(app.view);
      app.renderer.backgroundColor = '0x1c5a22';
      // The setup function is a custom function that we created to add the sprites. We will this below
      setup();
    }
  };

  return <div ref={updateContainer} />;
};

PlanetMap.propTypes = {
  tiles: arrayOf(shape()),
  setSelectedBuildingId: func.isRequired,
};

PlanetMap.defaultProps = {
  tiles: [],
};

export default PlanetMap;
