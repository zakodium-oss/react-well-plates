import { Meta } from '@storybook/react';
import React, { CSSProperties, useState } from 'react';

import { IWellPickerProps, MultiWellPicker } from '../src';

export default {
  title: 'Example/MultiWellPicker',
  component: MultiWellPicker,
  args: {
    rows: 8,
    columns: 12,
    value: [8],
    disabled: [2],
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
      renderText={({ index, label }) => {
        return (
          <div style={{ fontSize: 12 }}>
            <div>{label}</div>
            <div>{index}</div>
          </div>
        );
      }}
      value={[14]}
      disabled={[5, 20]}
      rangeSelectionMode="zone"
      style={({ index, wellPlate, disabled, booked, selected }) => {
        const position = wellPlate.getPosition(index, 'row_column');
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

  return <MultiWellPicker value={value} onChange={setValue} {...otherProps} />;
}
