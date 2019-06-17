import React from 'react';

const withWrapper = Wrapper => {
  return (props = {}, childProps = {}) => Component =>
    // eslint-disable-next-line react/prefer-stateless-function
    class extends React.Component {
      render() {
        return (
          <Wrapper {...props}>
            <Component {...this.props} {...childProps} />
          </Wrapper>
        );
      }
    };
};

export default withWrapper;
