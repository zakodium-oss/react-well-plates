import React, {
  CSSProperties,
  FunctionComponent,
  SyntheticEvent,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { WellPlate as WellPlateClass, PositionFormat } from 'well-plates';

import Well from './Well';

export interface Cell {
  index: number;
  label: string;
  wellPlate: WellPlateClass;
}

interface IWellPlateCommonProps {
  wellSize?: number;
}

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

interface IWellPlateProps extends IWellPlateCommonProps {
  rows: number;
  columns: number;
  format?: PositionFormat;
  wellClassName?: (cell: Cell) => string | undefined;
  text?: (cell: Cell) => ReactNode;
  wellStyle?: (cell: Cell) => CSSProperties;
  onClick?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: React.MouseEvent,
  ) => void;
  onEnter?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: SyntheticEvent,
  ) => void;
  onLeave?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: SyntheticEvent,
  ) => void;
  onMouseDown?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: React.MouseEvent,
  ) => void;
  onMouseUp?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: React.MouseEvent,
  ) => void;
}

const WellPlate: FunctionComponent<IWellPlateProps> = (props) => {
  const {
    rows,
    columns,
    format,
    onClick,
    onMouseDown,
    onMouseUp,
    onLeave,
    onEnter,
    wellStyle,
    wellClassName,
    text,
    ...otherProps
  } = props;
  const wellPlate = useMemo(() => {
    return new WellPlateClass({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);

  const onClickCallback = useCallback(
    (value: number, e: React.MouseEvent) => {
      const label = wellPlate.getPositionCode(value);
      if (onClick) onClick(value, label, wellPlate, e);
    },
    [onClick, wellPlate],
  );

  const onMouseDownCallback = useCallback(
    (value: number, e: React.MouseEvent) => {
      const label = wellPlate.getPositionCode(value);
      if (onMouseDown) onMouseDown(value, label, wellPlate, e);
    },
    [onMouseDown, wellPlate],
  );

  const onLeaveCallback = useCallback(
    (value: number, e: React.SyntheticEvent) => {
      const label = wellPlate.getPositionCode(value);
      if (onLeave) onLeave(value, label, wellPlate, e);
    },
    [onLeave, wellPlate],
  );

  const onEnterCallback = useCallback(
    (value: number, e: React.SyntheticEvent) => {
      const label = wellPlate.getPositionCode(value);
      if (onEnter) onEnter(value, label, wellPlate, e);
    },
    [onEnter, wellPlate],
  );

  const wellStyleCallback = useCallback(
    (index: number) => {
      const label = wellPlate.getPositionCode(index);
      if (wellStyle) return wellStyle({ index, label, wellPlate });
    },
    [wellStyle, wellPlate],
  );

  const wellClassNameCallback = useCallback(
    (index: number) => {
      const label = wellPlate.getPositionCode(index);
      if (wellClassName) {
        return wellClassName({ index, label, wellPlate });
      }
    },
    [wellClassName, wellPlate],
  );

  const textCallback = useCallback(
    (index: number) => {
      const label = wellPlate.getPositionCode(index);
      if (text) return text({ index, label, wellPlate });
      return label;
    },
    [text, wellPlate],
  );

  return (
    <WellPlateInternal
      plate={wellPlate}
      onClick={onClickCallback}
      text={textCallback}
      onMouseDown={onMouseDownCallback}
      onLeave={onLeaveCallback}
      onEnter={onEnterCallback}
      wellStyle={wellStyleCallback}
      wellClassName={wellClassNameCallback}
      {...otherProps}
    />
  );
};

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

WellPlate.defaultProps = {
  wellSize: 40,
};

export default WellPlate;
