import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

export default () => ({
  production: {
    display: 'flex',
    fontSize: '10px',
    // float: 'left',
    display: 'flex',
    justifyContent: "flex-end"
  },
  productionItem: {
    display: 'flex',
    marginRight: '10px',
    // '&:first-child': {
    //   color: green[500],
    // },
    // '&:last-child': {
    //   color: red[500],
    // },
  },
});
