/* eslint-disable react/jsx-no-bind */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { shape, bool, func, string } from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const Form = props => {
  const {
    classes,
    values: { username, password, confirmPassword, email },
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
    <form className={classes.form} noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            helperText={touched.username ? errors.username : ''}
            error={touched.username && Boolean(errors.username)}
            value={username}
            onChange={change.bind(null, 'username')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            type="email"
            autoComplete="email"
            helperText={touched.email ? errors.email : ''}
            error={touched.email && Boolean(errors.email)}
            value={email}
            onChange={change.bind(null, 'email')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
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
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            id="confirmPassword"
            name="confirmPassword"
            helperText={touched.confirmPassword ? errors.confirmPassword : ''}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            label="Confirm Password"
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={change.bind(null, 'confirmPassword')}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label="I want to receive inspiration, marketing promotions and updates via email."
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={!isValid}
      >
        Sign Up
      </Button>
      <Grid container justify="flex-end">
        <Grid item>
          <Link to="/portal/login" variant="body2" component={RouterLink}>
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

Form.propTypes = {
  classes: shape({}).isRequired,
  values: shape({
    username: string.isRequired,
    password: string.isRequired,
    confirmPassword: string.isRequired,
  }).isRequired,
  touched: shape({}).isRequired,
  isValid: bool.isRequired,
  errors: shape({}).isRequired,
  handleChange: func.isRequired,
  handleSubmit: func.isRequired,
  setFieldTouched: func.isRequired,
};

export default Form;
