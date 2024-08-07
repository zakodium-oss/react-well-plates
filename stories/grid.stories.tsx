import { Meta } from '@storybook/react';
import React, { CSSProperties, useState } from 'react';

import { IWellPickerProps, MultiWellPicker, WellPlate } from '../src';

export default {
  title: 'Example/GridWellPlate',
  component: WellPlate,
  argTypes: {
    rows: {
      defaultValue: 8,
      control: 'number',
    },
    columns: {
      defaultValue: 12,
      control: 'number',
    },
  },
} as Meta;

export function GridWellPlate() {
  return (
    <WellPlate
      rows={8}
      columns={12}
      displayAsGrid
      headerStyle={({ position }) => {
        if (position.column % 2 === 0 && position.row === -1) {
          return {
            backgroundColor: 'rgb(202, 128, 245)',
          };
        }

        if (position.row % 2 === 0 && position.column === -1) {
          return {
            backgroundColor: 'rgb(204, 211, 243)',
          };
        }
      }}
      wellStyle={({ position }) => {
        if (position.column % 2 === 0 && position.row % 2 === 0) {
          return {
            backgroundColor: 'rgb(202, 169, 204)',
          };
        } else if (position.column % 2 === 0 && position.row % 2 !== 0) {
          return {
            backgroundColor: 'rgb(202, 128, 245)',
          };
        } else if (position.column % 2 !== 0 && position.row % 2 === 0) {
          return {
            backgroundColor: 'rgb(204, 211, 243)',
          };
        } else {
          return {
            backgroundColor: 'white',
          };
        }
      }}
    />
  );
}

export function CustomGridWellPlate() {
  return (
    <WellPlate
      displayAsGrid
      rows={8}
      columns={12}
      wellSize={50}
      headerText={({ position }) => {
        if (position.column > 5) {
          return position.column;
        } else if (position.column > 3) {
          return null;
        } else if (position.column > 2) {
          return '';
        } else if (position.row > 6) {
          return position.row;
        } else if (position.row === 4) {
          return null;
        } else if (position.row === 3) {
          return '';
        }
      }}
      renderText={({ index }) => {
        if (index === 0) {
          return undefined;
        } else if (index === 1) {
          return null;
        } else if (index === 2) {
          return '';
        } else {
          return (
            <div style={{ fontSize: 12 }}>
              <div>test</div>
              <div>{index}</div>
            </div>
          );
        }
      }}
      wellStyle={({ wellPlate, index }) => {
        const factor = Math.round(
          (index / (wellPlate.rows * wellPlate.columns)) * 120 + (255 - 120),
        );
        return {
          backgroundColor: `rgb(${factor}, ${factor}, ${factor})`,
        };
      }}
    />
  );
}

export function CustomWellPicker() {
  return (
    <StateFullWellPicker
      displayAsGrid
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
