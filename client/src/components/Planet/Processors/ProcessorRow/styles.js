export default () => ({
  root: {
    flexGrow: 1,
  },
  infos: {
    margin: '20px',
  },
  recipeInput: {
    color: 'green',
  },
  recipeOutput: {
    color: 'red',
  },
  select: {
    backgroundColor: 'white',
    borderRadius: '5px',
    paddingLeft: '30px',
    paddingRight: '30px',
    '&:focus': {
      backgroundColor: 'white',
    },
  },
});
