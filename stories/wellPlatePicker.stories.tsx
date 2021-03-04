import { Meta } from '@storybook/react';
import React, { CSSProperties, useState } from 'react';

import { RangeSelectionMode } from '../src/WellPicker';
import { IWellPickerProps, MultiWellPicker } from '../src/index';

export default {
  title: 'Example/MultiWellPicker',
  component: MultiWellPicker,
  argTypes: {
    rows: {
      defaultValue: 8,
      control: 'number',
    },
    columns: {
      defaultValue: 12,
      control: 'number',
    },
    value: {
      defaultValue: [8],
      control: 'array',
    },
    disabled: {
      defaultValue: [2],
      control: 'array',
    },
  },
} as Meta;

export function WellPicker(props: IWellPickerProps) {
  return <StateFullWellPicker {...props} />;
}

export function CustomWellPicker() {
  return (
    <StateFullWellPicker
      rows={8}
      columns={12}
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
      rangeSelectionMode={RangeSelectionMode.zone}
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
        if (booked && !disabled) {
          styles.borderColor = 'red';
        }
        return styles;
      }}
    />
  );
}

type IStateFullWellPickerProps = Omit<IWellPickerProps, 'onChange'>;

function StateFullWellPicker(props: IStateFullWellPickerProps) {
  const { value: initialValue, ...otherProps } = props;
  const [value, setValue] = useState(initialValue);

  return (
    <MultiWellPicker
      displayAsGrid
      value={value}
      onChange={setValue}
      {...otherProps}
    />
  );
}
