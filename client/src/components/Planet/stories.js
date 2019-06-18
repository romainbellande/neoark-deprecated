import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';

import Planet from '.';

storiesOf('Planet', module).add('to Storybook', () => <Planet />);
