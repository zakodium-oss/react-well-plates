import { withInfo } from '@storybook/addon-info';
import { withKnobs, select, number, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React, { useState, CSSProperties } from 'react';
import { PositionFormat } from 'well-plates';

import {
  WellPlate,
  MultiWellPicker,
  RangeSelectionMode,
  IWellPickerProps,
} from '../src/index';

function getFormatKnob() {
  return select(
    'Position format',
    {
      'Letter+Number': PositionFormat.LetterNumber,
      'Number+Number': PositionFormat.NumberNumber,
      Sequential: PositionFormat.Sequential,
    },
    PositionFormat.LetterNumber,
  );
}

function getRangeSelectionModeKnob() {
  return select(
    'Range selection mode',
    {
      zone: RangeSelectionMode.zone,
      'By row': RangeSelectionMode.rangeByRow,
      'By column': RangeSelectionMode.rangeByColumn,
      off: RangeSelectionMode.off,
    },
    RangeSelectionMode.zone,
  );
}

function getPickModeKnob() {
  return boolean('Pick mode on / off', true);
}

function getRowsKnob() {
  return number('Rows', 8);
}

function getColumnsKnob() {
  return number('Columns', 12);
}

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
        text={({ index }) => {
          if (index === 0) {
            return;
          } else if (index === 1) {
            return '';
          } else if (index === 2) {
            return null;
          } else {
            return (
              <div style={{ fontSize: 12 }}>
                <div>test</div>
                <div>{index}</div>
              </div>
            );
          }
        }}
        wellStyle={({ label, wellPlate }) => {
          const factor = Math.round(
            (wellPlate.getIndex(label) / (wellPlate.rows * wellPlate.columns)) *
              120 +
              (255 - 120),
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
        format={getFormatKnob()}
        value={[8]}
        disabled={[5, 20]}
        rangeSelectionMode={getRangeSelectionModeKnob()}
        pickMode={getPickModeKnob()}
      />
    );
  })
  .add('Well picker with custom styles and text', () => {
    return (
      <StateFullWellPicker
        rows={getRowsKnob()}
        columns={getColumnsKnob()}
        format={getFormatKnob()}
        wellSize={50}
        text={({ index, label }) => {
          return (
            <div style={{ fontSize: 12 }}>
              <div>{label}</div>
              <div>{index}</div>
            </div>
          );
        }}
        value={[14]}
        disabled={[5, 20]}
        rangeSelectionMode={getRangeSelectionModeKnob()}
        pickMode={getPickModeKnob()}
        style={({ index, wellPlate, disabled, booked, selected }) => {
          const position = wellPlate.getPosition(index);
          const styles: CSSProperties = {};
          if (disabled) {
            if (position.row === 1) {
              styles.backgroundColor = 'grey';
            } else {
              styles.backgroundColor = 'lightgray';
            }
          }
          if (selected) {
            styles.backgroundColor = 'pink';
          }
          if (booked) {
            styles.borderColor = 'red';
          }
          return styles;
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
