import React, { useState } from 'react';
import { WellPlate as WellPlateClass } from 'well-plates';
import { withInfo } from '@storybook/addon-info';

import { WellPlate, WellPicker } from '../src/index';
import { storiesOf } from '@storybook/react';

const wellPlate = new WellPlateClass<string>({ rows: 8, columns: 12 });

storiesOf('Well plate', module)
  .addDecorator(withInfo)
  .add('Regular size', () => {
    return <WellPlate plate={wellPlate} />;
  })
  .add('Large size', () => {
    return <WellPlate plate={wellPlate} wellSize={60} />;
  })
  .add('Small size', () => {
    return (
      <WellPlate
        plate={wellPlate}
        wellSize={30}
        wellStyle={() => ({
          fontSize: 'x-small'
        })}
      />
    );
  })
  .add('Custom styles', () => {
    return (
      <WellPlate
        plate={wellPlate}
        wellSize={50}
        wellStyle={(label) => {
          const factor = Math.round(
            (wellPlate.getIndex(label) / (wellPlate.rows * wellPlate.columns)) *
              120 +
              (255 - 120)
          );
          return {
            backgroundColor: `rgb(${factor}, ${factor}, ${factor})`,
            borderColor: 'green',
            borderWidth: 2
          };
        }}
      />
    );
  });

storiesOf('Well picker', module)
  .addDecorator(withInfo)
  .add('Well picker', () => {
    return <StateFullWellPicker />;
  });

function StateFullWellPicker() {
  const [value, setValue] = useState([]);
  console.log(value);
  return (
    <WellPicker
      rows={12}
      columns={8}
      value={value}
      disabled={['A5', 'C1']}
      onSelect={setValue}
      style={{
        default: { borderColor: 'black' },
        disabled: { backgroundColor: 'gray', borderColor: 'black' },
        booked: { borderColor: 'orange' },
        selected: { backgroundColor: 'green' }
      }}
      className={{
        default: '',
        disabled: '',
        booked: '',
        selected: ''
      }}
    />
  );
}
