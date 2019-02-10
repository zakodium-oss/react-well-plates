# react-well-plates

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Render well plates in react.

## [Storybook](https://zakodium.github.io/react-well-plates/)

## Installation

`$ npm install --save react-well-plates`

There is a peer dependency on [well-plates](https://www.npmjs.com/package/well-plates). This library is used to create a well plate and allows to associate data to each well.

## Usage

```jsx
import { WellPlate as WellPlateComponent } from 'react-well-plates';
import { WellPlate } from 'well-plates';

function () {
    const wellPlate = new WellPlate({
      rows: 8,
      columns: 12
    });
    return <WellPlatesComponent wellPlate={wellPlate} />
}
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/react-well-plates.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/react-well-plates
[download-image]: https://img.shields.io/npm/dm/react-well-plates.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/react-well-plates
