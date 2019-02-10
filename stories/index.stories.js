import React from 'react';
import { WellPlate as WellPlateClass } from 'well-plates';
import { withInfo } from '@storybook/addon-info';

console.log(withInfo);
import { WellPlate } from '../src/index';
import { storiesOf } from '@storybook/react';

const wellPlate = new WellPlateClass({ rows: 8, columns: 12 });

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
        wellStyle={(plate, label) => {
          const factor = Math.round(
            (plate.getIndex(label) / (plate.rows * plate.columns)) * 120 +
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
