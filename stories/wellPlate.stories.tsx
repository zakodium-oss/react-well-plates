import { Meta } from '@storybook/react';
import React from 'react';

import { WellPlate, IWellPlateProps } from '../src/index';

export default {
  title: 'Example/WellPlate',
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

export function Control(props: IWellPlateProps) {
  return <WellPlate {...props} />;
}

export function SmallWellPlate() {
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
}

export function LargeWellPlate() {
  return <WellPlate rows={8} columns={12} wellSize={60} />;
}

export function CustomWellPlate() {
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
          (wellPlate.getPosition(label, 'index') /
            (wellPlate.rows * wellPlate.columns)) *
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
}
