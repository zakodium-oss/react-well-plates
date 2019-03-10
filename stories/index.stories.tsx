import React, { useState } from 'react';
import { WellPlate as WellPlateClass, PositionFormat } from 'well-plates';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, select, number } from '@storybook/addon-knobs';

import { WellPlate, WellPicker, MultiSelectionMode } from '../src/index';
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
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .add('Well picker', () => {
    return (
      <StateFullWellPicker
        rows={number('Rows', 8)}
        columns={number('Columns', 12)}
        format={select('Position format', {
          'Letter+Number': PositionFormat.LetterNumber,
          Sequential: PositionFormat.Sequential
        })}
        value={['D2']}
        disabled={['A5', 'C1']}
        multiSelectionMode={select(
          'Multi selection mode',
          {
            zone: MultiSelectionMode.zone,
            'By row': MultiSelectionMode.rangeByRow,
            'By column': MultiSelectionMode.rangeByColumn
          },
          MultiSelectionMode.zone
        )}
      />
    );
  });

function StateFullWellPicker(props) {
  const { value: initialValue, ...otherProps } = props;
  const [value, setValue] = useState(initialValue);
  return <WellPicker value={value} onSelect={setValue} {...otherProps} />;
}
