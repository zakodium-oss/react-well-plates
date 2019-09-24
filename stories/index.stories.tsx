import React, { useState } from 'react';
import { PositionFormat } from 'well-plates';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, select, number, boolean } from '@storybook/addon-knobs';

import {
  WellPlate,
  MultiWellPicker,
  RangeSelectionMode,
  IWellPickerProps,
} from '../src/index';
import { storiesOf } from '@storybook/react';

storiesOf('Well plate', module)
  .addDecorator(withInfo)
  .add('Regular size', () => {
    return <WellPlate rows={8} columns={12} />;
  })
  .add('Large size', () => {
    return <WellPlate rows={8} columns={12} wellSize={60} />;
  })
  .add('Small size', () => {
    return (
      <WellPlate
        rows={8}
        columns={12}
        wellSize={30}
        wellStyle={() => ({
          fontSize: 'x-small',
        })}
      />
    );
  })
  .add('Custom styles and text', () => {
    return (
      <WellPlate
        rows={8}
        columns={12}
        wellSize={50}
        text={(label) => (
          <div style={{ fontSize: 12 }}>
            <div>test</div>
            <div>{label}</div>
          </div>
        )}
        wellStyle={(value, label, wellPlate) => {
          const factor = Math.round(
            (wellPlate.getIndex(label) / (wellPlate.rows * wellPlate.columns)) *
              120 +
              (255 - 120)
          );
          return {
            backgroundColor: `rgb(${factor}, ${factor}, ${factor})`,
            borderColor: 'green',
            borderWidth: 2,
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
        format={select(
          'Position format',
          {
            'Letter+Number': PositionFormat.LetterNumber,
            'Number+Number': PositionFormat.NumberNumber,
            Sequential: PositionFormat.Sequential,
          },
          PositionFormat.LetterNumber
        )}
        value={[8]}
        disabled={[5, 20]}
        rangeSelectionMode={select(
          'Range selection mode',
          {
            zone: RangeSelectionMode.zone,
            'By row': RangeSelectionMode.rangeByRow,
            'By column': RangeSelectionMode.rangeByColumn,
            off: RangeSelectionMode.off,
          },
          RangeSelectionMode.zone
        )}
        pickMode={boolean('Pick mode on', true)}
      />
    );
  })
  .add('Well picker with custom styles and text', () => {
    return (
      <StateFullWellPicker
        rows={number('Rows', 8)}
        columns={number('Columns', 12)}
        format={select(
          'Position format',
          {
            'Letter+Number': PositionFormat.LetterNumber,
            'Number+Number': PositionFormat.NumberNumber,
            Sequential: PositionFormat.Sequential,
          },
          PositionFormat.LetterNumber
        )}
        wellSize={50}
        text={(index: number, label: string) => {
          return (
            <div style={{ fontSize: 12 }}>
              <div>{label}</div>
              <div>{index}</div>
            </div>
          );
        }}
        value={[14]}
        disabled={[5, 20]}
        rangeSelectionMode={select(
          'Range selection mode',
          {
            zone: RangeSelectionMode.zone,
            'By row': RangeSelectionMode.rangeByRow,
            'By column': RangeSelectionMode.rangeByColumn,
            off: RangeSelectionMode.off,
          },
          RangeSelectionMode.zone
        )}
        pickMode={boolean('Pick mode on', true)}
        style={{
          disabled: (index, label, wellPlate) => {
            const position = wellPlate.getPosition(index);
            if (position.row === 1) {
              return {
                backgroundColor: 'grey',
              };
            } else {
              return {
                backgroundColor: 'lightgrey',
              };
            }
          },
          selected: {
            backgroundColor: 'pink',
          },
          booked: {
            borderColor: 'red',
          },
        }}
      />
    );
  });

type IStateFullWellPickerProps = Omit<IWellPickerProps, 'onChange'>;

function StateFullWellPicker(props: IStateFullWellPickerProps) {
  const { value: initialValue, ...otherProps } = props;
  const [value, setValue] = useState(initialValue);
  return <MultiWellPicker value={value} onChange={setValue} {...otherProps} />;
}
