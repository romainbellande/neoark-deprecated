import React from 'react';
import { arrayOf, shape } from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link as RouterLink } from 'react-router-dom';

function ListItemLink(props) {
  return <ListItem button component={RouterLink} {...props} />;
}

const Planets = ({ planets, classes }) => {
  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Secondary mailbox folders">
        {planets.map(({ id, name }) => (
          <ListItemLink
            key={`planet-${id}`}
            to={`/planets/${id}`}
            classes={{ root: classes.listItem }}
            divider
          >
            <ListItemText primary={name} />
          </ListItemLink>
        ))}
      </List>
    </div>
  );
};

Planets.propTypes = {
  classes: shape({}).isRequired,
  planets: arrayOf(shape({})).isRequired,
};

export default Planets;
