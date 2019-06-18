import React from 'react';
import { arrayOf, shape } from 'prop-types';

const Planets = ({ planets }) => {
  return (
    <div>
      {planets.map(({ id, name }) => (
        <li key={`planet-${id}`}>{name}</li>
      ))}
    </div>
  );
};

Planets.propTypes = {
  planets: arrayOf(shape({})).isRequired,
};

export default Planets;
