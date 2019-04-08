import React, { useState } from 'react';
import { PositionFormat } from 'well-plates';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, select, number } from '@storybook/addon-knobs';

import {
  SingleWellPicker,
  WellPlate,
  MultiWellPicker,
  MultiSelectionMode
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
          fontSize: 'x-small'
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
        wellStyle={(label, wellPlate) => {
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
  .add('Multi well picker', () => {
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
  })
  .add('Multi well picker with custom styles and text', () => {
    return (
      <StateFullWellPicker
        rows={number('Rows', 8)}
        columns={number('Columns', 12)}
        format={select('Position format', {
          'Letter+Number': PositionFormat.LetterNumber,
          Sequential: PositionFormat.Sequential
        })}
        wellSize={50}
        text={(label, wellPlate) => {
          return (
            <div style={{ fontSize: 12 }}>
              <div>{label}</div>
              <div>{wellPlate.getIndex(label)}</div>
            </div>
          );
        }}
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
        style={{
          disabled: (label, wellPlate) => {
            if (label.startsWith('A')) {
              return {
                backgroundColor: 'grey'
              };
            } else {
              return {
                backgroundColor: 'lightgrey'
              };
            }
          },
          selected: {
            backgroundColor: 'pink'
          },
          booked: {
            borderColor: 'red'
          }
        }}
      />
    );
  })
  .add('Single well picker', () => {
    return (
      <StateFullSingleWellPicker
        rows={number('Rows', 8)}
        columns={number('Columns', 12)}
        format={select('Position format', {
          'Letter+Number': PositionFormat.LetterNumber,
          Sequential: PositionFormat.Sequential
        })}
        value="D2"
        disabled={['E5', 'C3']}
      />
    );
  });

function StateFullWellPicker(props) {
  const { value: initialValue, ...otherProps } = props;
  const [value, setValue] = useState(initialValue);
  return <MultiWellPicker value={value} onChange={setValue} {...otherProps} />;
}

function StateFullSingleWellPicker(props) {
  const { value: initialValue, ...otherProps } = props;
  const [value, setValue] = useState(initialValue);
  return <SingleWellPicker value={value} onChange={setValue} {...otherProps} />;
}
