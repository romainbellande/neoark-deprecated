import React from 'react';
import { func, bool, node } from 'prop-types';
import Dialog from '@material-ui/core/Dialog';

const AppDialog = ({ onClose, open, children }) => {
  return (
    <Dialog onClose={onClose} open={open}>
      {children}
    </Dialog>
  );
};

AppDialog.propTypes = {
  children: node.isRequired,
  onClose: func.isRequired,
  open: bool,
};

AppDialog.defaultProps = {
  open: false,
};

export default AppDialog;
