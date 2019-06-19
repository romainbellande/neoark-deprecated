import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

export default () => ({
  production: {
    display: 'flex',
    fontSize: '10px',
    marginLeft: '10px',
    // float: 'left',
    // display: 'flex',
    // justifyContent: "flex-start"
  },
  productionItem: {
    marginRight: '10px',
    marginLeft: '10px',
    display: 'flex',
    justifyContent: "flex-end"
    // '&:first-child': {
    //   color: green[500],
    // },
    // '&:last-child': {
    //   color: red[500],
    // },
  },
});
