/* eslint-disable react/jsx-no-bind */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link as RouterLink } from 'react-router-dom';
import { shape, string, func, bool } from 'prop-types';

function Form(props) {
  const {
    classes,
    values: { email, password },
    touched,
    isValid,
    errors,
    handleChange,
    handleSubmit,
    setFieldTouched,
  } = props;

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };

  return (
    <form className={classes.root} noValidate onSubmit={handleSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        helperText={touched.email ? errors.email : ''}
        error={touched.email && Boolean(errors.email)}
        value={email}
        onChange={change.bind(null, 'email')}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        helperText={touched.password ? errors.password : ''}
        error={touched.password && Boolean(errors.password)}
        value={password}
        onChange={change.bind(null, 'password')}
      />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={!isValid}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          <Link to="/" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link to="/portal/register" variant="body2" component={RouterLink}>
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </form>
  );
}

Form.propTypes = {
  classes: shape({}).isRequired,
  values: shape({
    email: string.isRequired,
    password: string.isRequired,
  }).isRequired,
  touched: shape({}).isRequired,
  isValid: bool.isRequired,
  errors: shape({}).isRequired,
  handleChange: func.isRequired,
  handleSubmit: func.isRequired,
  setFieldTouched: func.isRequired,
};

export default Form;
