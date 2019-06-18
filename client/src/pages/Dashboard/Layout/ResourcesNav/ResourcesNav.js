import React from 'react';
import { shape, arrayOf, string, number } from 'prop-types';
import List from '@material-ui/core/List';

import ResourceNavItem from './ResourceNavItem';

function ResourcesNav({ inventory, electricity }) {
  return (
    inventory && (
      <div>
        <List disablePadding>
          {[electricity, ...inventory].map(item => (
            <ResourceNavItem key={`resource-item-${item.id}`} {...item} />
          ))}
        </List>
      </div>
    )
  );
}

ResourcesNav.propTypes = {
  inventory: arrayOf(shape({})),
  eletricity: shape({
    classes: shape({}).isRequired,
    name: string.isRequired,
    produced: number.isRequired,
    consumed: number.isRequired,
    currentPercent: number.isRequired,
  }),
};

ResourcesNav.defaultProps = {
  inventory: [],
};

export default ResourcesNav;
