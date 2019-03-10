import React, { CSSProperties, FunctionComponent, SyntheticEvent } from 'react';
import { WellPlate as WellPlateClass } from 'well-plates';

import Well from './Well';

interface IWellPlateProps {
  plate: WellPlateClass;
  wellSize?: number;
  wellClassName?: (label: string) => string;
  wellStyle?: (label) => CSSProperties;
  onClick?: (well: string, e: React.MouseEvent) => void;
  onEnter?: (well: string, e: SyntheticEvent) => void;
  onLeave?: (well: string, e: SyntheticEvent) => void;
  onMouseDown?: (well: string, e: React.MouseEvent) => void;
  onMouseUp?: (well: string, e: React.MouseEvent) => void;
}

// type GenericWellPlateComponent<T> = FunctionComponent<IWellPlateProps<T>>;

const WellPlate: FunctionComponent<IWellPlateProps> = (props) => {
  const { plate, wellSize } = props;

  const rowLabels = plate.rowLabels;
  const columnLabels = plate.columnLabels;

  const boxPadding = 4;
  const boxBorder = 1;

  const headerStyle: CSSProperties = {
    width: wellSize,
    textAlign: 'center'
  };

  const wellStyle: CSSProperties = {
    width: wellSize,
    height: wellSize,
    userSelect: 'none'
  };

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: wellSize
  };

  const boxStyle: CSSProperties = {
    paddingBottom: boxPadding,
    paddingRight: boxPadding,
    borderWidth: boxBorder,
    borderStyle: 'solid',
    borderColor: 'black',
    width: wellSize * (plate.columns + 1) + boxPadding + boxBorder
  };

  const headerColumnLabels = columnLabels.map((columnLabel) => (
    <div key={columnLabel} style={headerStyle}>
      {columnLabel}
    </div>
  ));

  const rows = rowLabels.map((rowLabel, rowIdx) => {
    const columns = columnLabels.map((columnLabel, columnIdx) => {
      const label = plate.getPositionCode({ row: rowIdx, column: columnIdx });
      return (
        <div key={columnLabel} style={wellStyle}>
          <Well
            className={props.wellClassName && props.wellClassName(label)}
            style={props.wellStyle && props.wellStyle(label)}
            onClick={props.onClick}
            onEnter={props.onEnter}
            onLeave={props.onLeave}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            value={label}
            size={wellSize}
          />
        </div>
      );
    });
    return (
      <div key={rowLabel} style={rowStyle}>
        <div style={headerStyle}>{rowLabel}</div>
        {columns}
      </div>
    );
  });

  return (
    <div style={boxStyle}>
      <div style={rowStyle}>
        <div style={headerStyle} />
        {headerColumnLabels}
      </div>
      {rows}
    </div>
  );
};

WellPlate.defaultProps = {
  wellSize: 40
};

export default WellPlate;
