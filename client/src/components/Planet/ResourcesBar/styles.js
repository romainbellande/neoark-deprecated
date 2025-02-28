export default () => ({
  root: {
    display: 'flex',
    // background: '#383838',
    padding: '23px 23px',
  },
  item: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    textAlign: 'justify',
    alignItems: 'baseline',
    marginRight: '10px',
  },
  label: {
    marginRight: '10px',
  },
  value: {
    color: '#5b9cc5',
    padding: '0px 5px;',
    'text-align': 'right',
    fontSize: '12px',
  },
});
