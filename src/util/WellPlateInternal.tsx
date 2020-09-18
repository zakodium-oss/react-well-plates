import React, {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import { WellPlate as WellPlateClass } from 'well-plates';

import Well from './Well';

interface IWellPlateInternalProps extends IWellPlateCommonProps {
  plate: WellPlateClass;
  wellClassName?: (index: number) => string | undefined;
  wellStyle?: (index: number) => CSSProperties;
  text?: (index: number) => ReactNode;
  onEnter?: (index: number, e: SyntheticEvent) => void;
  onLeave?: (index: number, e: SyntheticEvent) => void;
  onMouseDown?: (index: number, e: React.MouseEvent) => void;
  onMouseUp?: (index: number, e: React.MouseEvent) => void;
  onClick?: (index: number, e: React.MouseEvent) => void;
}

export const WellPlateInternal: FunctionComponent<IWellPlateInternalProps> = (
  props,
) => {
  const { plate, wellSize = 40 } = props;

  const rowLabels = plate.rowLabels;
  const columnLabels = plate.columnLabels;

  const boxPadding = 4;
  const boxBorder = 1;

  const headerStyle: CSSProperties = {
    width: wellSize,
    textAlign: 'center',
  };

  const wellStyle: CSSProperties = {
    width: wellSize,
    height: wellSize,
    userSelect: 'none',
  };

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: wellSize,
  };

  const boxStyle: CSSProperties = {
    paddingBottom: boxPadding,
    paddingRight: boxPadding,
    borderWidth: boxBorder,
    borderStyle: 'solid',
    borderColor: 'black',
    width: wellSize * (plate.columns + 1) + boxPadding + boxBorder,
  };

  const headerColumnLabels = columnLabels.map((columnLabel) => (
    <div key={columnLabel} style={headerStyle}>
      {columnLabel}
    </div>
  ));

  const rows = rowLabels.map((rowLabel, rowIdx) => {
    const columns = columnLabels.map((columnLabel, columnIdx) => {
      const index = plate.getIndex({ row: rowIdx, column: columnIdx });
      return (
        <div key={columnLabel} style={wellStyle}>
          <Well
            wellPlate={plate}
            className={props.wellClassName && props.wellClassName(index)}
            style={props.wellStyle && props.wellStyle(index)}
            onClick={props.onClick}
            onEnter={props.onEnter}
            onLeave={props.onLeave}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            text={props.text && props.text(index)}
            value={index}
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
