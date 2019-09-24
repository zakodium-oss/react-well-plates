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

interface IWellPlateCommonProps {
  wellSize?: number;
}

interface IWellPlateInternalProps extends IWellPlateCommonProps {
  plate: WellPlateClass;
  wellClassName?: (value: number) => string;
  wellStyle?: (value: number) => CSSProperties;
  text?: (value: number) => ReactNode;
  onEnter?: (value: number, e: SyntheticEvent) => void;
  onLeave?: (value: number, e: SyntheticEvent) => void;
  onMouseDown?: (value: number, e: React.MouseEvent) => void;
  onMouseUp?: (value: number, e: React.MouseEvent) => void;
  onClick?: (value: number, e: React.MouseEvent) => void;
}

interface IWellPlateProps extends IWellPlateCommonProps {
  rows: number;
  columns: number;
  format?: PositionFormat;
  wellClassName?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass
  ) => string;
  text?: (value: number, label: string, wellPlate: WellPlateClass) => ReactNode;
  wellStyle?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass
  ) => CSSProperties;
  onClick?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: React.MouseEvent
  ) => void;
  onEnter?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: SyntheticEvent
  ) => void;
  onLeave?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: SyntheticEvent
  ) => void;
  onMouseDown?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: React.MouseEvent
  ) => void;
  onMouseUp?: (
    value: number,
    label: string,
    wellPlate: WellPlateClass,
    e: React.MouseEvent
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
  const plate = useMemo(() => {
    return new WellPlateClass({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);

  const onClickCallback = useCallback(
    (value: number, e: React.MouseEvent) => {
      const label = plate.getPositionCode(value);
      if (onClick) onClick(value, label, plate, e);
    },
    [onClick, plate]
  );

  const onMouseDownCallback = useCallback(
    (value: number, e: React.MouseEvent) => {
      const label = plate.getPositionCode(value);
      if (onMouseDown) onMouseDown(value, label, plate, e);
    },
    [onMouseDown, plate]
  );

  const onLeaveCallback = useCallback(
    (value: number, e: React.SyntheticEvent) => {
      const label = plate.getPositionCode(value);
      if (onLeave) onLeave(value, label, plate, e);
    },
    [onLeave, plate]
  );

  const onEnterCallback = useCallback(
    (value: number, e: React.SyntheticEvent) => {
      const label = plate.getPositionCode(value);
      if (onEnter) onEnter(value, label, plate, e);
    },
    [onEnter, plate]
  );

  const wellStyleCallback = useCallback(
    (value: number) => {
      const label = plate.getPositionCode(value);
      if (wellStyle) return wellStyle(value, label, plate);
    },
    [wellStyle, plate]
  );

  const wellClassNameCallback = useCallback(
    (value: number) => {
      const label = plate.getPositionCode(value);
      if (wellClassName) return wellClassName(value, label, plate);
    },
    [wellClassName, plate]
  );

  const textCallback = useCallback(
    (value: number) => {
      const label = plate.getPositionCode(value);
      if (text) return text(value, label, plate);
      return label;
    },
    [text, plate]
  );

  return (
    <WellPlateInternal
      plate={plate}
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
  props
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
            text={props.text ? props.text(index) : null}
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
