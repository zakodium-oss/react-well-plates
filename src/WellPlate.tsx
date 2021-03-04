import React, {
  CSSProperties,
  FunctionComponent,
  SyntheticEvent,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { WellPlate as WellPlateClass, PositionFormat } from 'well-plates';

import { WellPlateInternal } from './util/WellPlateInternal';
import { IWellPlateCommonProps } from './util/types';

export interface Cell {
  index: number;
  label: string;
  wellPlate: WellPlateClass;
}

export interface IWellPlateProps extends IWellPlateCommonProps {
  rows: number;
  columns: number;
  format?: PositionFormat;
  displayAsGrid?: boolean;
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
