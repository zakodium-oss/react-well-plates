import { Meta } from '@storybook/react';
import React from 'react';

import { IWellPlateProps, WellPlate } from '../src';

export default {
  title: 'Example/WellPlate',
  component: WellPlate,
  args: {
    rows: 8,
    columns: 12,
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
          return null;
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
