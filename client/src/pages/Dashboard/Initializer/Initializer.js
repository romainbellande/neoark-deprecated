import { useEffect } from 'react';
import { arrayOf, node, shape, number } from 'prop-types';

function Initializer({ planets, fetchPlanet, children }) {
  useEffect(() => {
    if (planets.length > 0) {
      fetchPlanet(planets[0].id);
    }
  }, [planets]);

  return children;
}

Initializer.propTypes = {
  children: node.isRequired,
  planets: arrayOf(
    shape({
      id: number.isRequired,
    })
  ),
};

Initializer.defaultProps = {
  planets: [],
};

export default Initializer;
