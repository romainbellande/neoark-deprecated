import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Formik } from 'formik';
import * as yup from 'yup';
import { func, shape } from 'prop-types';
import { Redirect } from 'react-router-dom';

import Form from './Form';

const initialValues = {
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
};

const validationSchema = yup.object({
  username: yup.string('Enter a username').required('Username is required !'),
  email: yup
    .string()
    .email('Enter a valid email.')
    .required('Email is required !'),
  password: yup
    .string('')
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter your password'),
  confirmPassword: yup
    .string('Enter your password')
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Password does not match'),
});

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Register(props) {
  console.log('props', props);
  const { onSubmit, user } = props;
  const classes = useStyles();

  return user ? (
    <Redirect to="/portal/login" />
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik
          initialValues={initialValues}
          render={formilProps => <Form {...formilProps} />}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        />
      </div>
      <Box mt={5}>
        <MadeWithLove />
      </Box>
    </Container>
  );
}

Register.propTypes = {
  onSubmit: func.isRequired,
  user: shape({}),
  location: shape({}).isRequired,
};

Register.defaultProps = {
  user: null,
};

export default Register;
