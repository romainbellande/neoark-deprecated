import React from 'react';

export default Context => (mapStateToProps, dispatchStateToProps) => {
  return Component =>
    // eslint-disable-next-line react/prefer-stateless-function
    class extends React.Component {
      render() {
        return (
          <Context.Consumer>
            {({ state, dispatch }) => {
              const stateProps = mapStateToProps ? mapStateToProps(state) : {};
              const dispatchProps = dispatchStateToProps ? dispatchStateToProps(dispatch) : {};
              return <Component {...this.props} {...stateProps} {...dispatchProps} />;
            }}
          </Context.Consumer>
        );
      }
    };
};
