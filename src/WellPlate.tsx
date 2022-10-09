import React, {
  CSSProperties,
  FunctionComponent,
  SyntheticEvent,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import {
  WellPlate as WellPlateClass,
  PositionFormat,
  RowColumnPosition,
} from 'well-plates';

import { WellPlateInternal } from './util/WellPlateInternal';
import { IWellPlateCommonProps } from './util/types';

export interface Cell {
  index: number;
  label: string;
  wellPlate: WellPlateClass;
  position: RowColumnPosition;
}

export interface HeaderCell {
  label: string;
  position: RowColumnPosition;
}

export interface IWellPlateProps extends IWellPlateCommonProps {
  rows: number;
  columns: number;
  format?: PositionFormat;
  displayAsGrid?: boolean;

  wellClassName?: (cell: Cell) => string | undefined;
  renderText?: (cell: Cell) => ReactNode;
  wellStyle?: (cell: Cell) => CSSProperties;

  headerClassName?: (cell: HeaderCell) => string | undefined;
  headerStyle?: (cell: HeaderCell) => CSSProperties;
  headerText?: (cell: HeaderCell) => ReactNode;

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

export const WellPlate: FunctionComponent<IWellPlateProps> = (props) => {
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
    renderText: text,
    headerStyle,
    ...otherProps
  } = props;

  const wellPlate = useMemo(() => {
    return new WellPlateClass({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);

  const onClickCallback = useCallback(
    (value: number, e: React.MouseEvent) => {
      const label = wellPlate.getPosition(value, 'formatted');
      if (onClick) onClick(value, label, wellPlate, e);
    },
    [onClick, wellPlate],
  );

  const onMouseDownCallback = useCallback(
    (value: number, e: React.MouseEvent) => {
      const label = wellPlate.getPosition(value, 'formatted');
      if (onMouseDown) onMouseDown(value, label, wellPlate, e);
    },
    [onMouseDown, wellPlate],
  );

  const onLeaveCallback = useCallback(
    (value: number, e: React.SyntheticEvent) => {
      const label = wellPlate.getPosition(value, 'formatted');
      if (onLeave) onLeave(value, label, wellPlate, e);
    },
    [onLeave, wellPlate],
  );

  const onEnterCallback = useCallback(
    (value: number, e: React.SyntheticEvent) => {
      const label = wellPlate.getPosition(value, 'formatted');
      if (onEnter) onEnter(value, label, wellPlate, e);
    },
    [onEnter, wellPlate],
  );

  const wellStyleCallback = useCallback(
    (index: number): CSSProperties => {
      const label = wellPlate.getPosition(index, 'formatted');
      const position = wellPlate.getPosition(index, 'row_column');

      return {
        userSelect: 'text',
        WebkitUserSelect: 'text',
        ...wellStyle?.({ index, label, wellPlate, position }),
      };
    },
    [wellStyle, wellPlate],
  );

  const headerStyleCallback = useCallback(
    (cell: HeaderCell): CSSProperties => {
      return {
        userSelect: 'text',
        WebkitUserSelect: 'text',
        ...headerStyle?.(cell),
      };
    },
    [headerStyle],
  );

  const wellClassNameCallback = useCallback(
    (index: number) => {
      const label = wellPlate.getPosition(index, 'formatted');
      const position = wellPlate.getPosition(index, 'row_column');

      if (wellClassName) {
        return wellClassName({ index, label, wellPlate, position });
      }
    },
    [wellClassName, wellPlate],
  );

  const textCallback = useCallback(
    (index: number) => {
      const label = wellPlate.getPosition(index, 'formatted');
      const position = wellPlate.getPosition(index, 'row_column');

      if (text) return text({ index, label, wellPlate, position });
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
      headerStyle={headerStyleCallback}
      {...otherProps}
    />
  );
};
