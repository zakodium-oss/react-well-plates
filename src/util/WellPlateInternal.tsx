import React, {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import { WellPlate as WellPlateClass } from 'well-plates';

import { HeaderCell } from '../WellPlate';

import Well from './Well';
import { IWellPlateCommonProps } from './types';

interface IWellPlateInternalProps extends IWellPlateCommonProps {
  plate: WellPlateClass;
  displayAsGrid?: boolean;
  onEnter?: (index: number, e: SyntheticEvent) => void;
  onLeave?: (index: number, e: SyntheticEvent) => void;
  onMouseDown?: (index: number, e: React.MouseEvent) => void;
  onMouseUp?: (index: number, e: React.MouseEvent) => void;
  onClick?: (index: number, e: React.MouseEvent) => void;

  text?: (index: number) => ReactNode;
  wellClassName?: (index: number) => string | undefined;
  wellStyle?: (index: number) => CSSProperties;

  headerClassName?: (cell: HeaderCell) => string | undefined;
  headerStyle?: (cell: HeaderCell) => CSSProperties;
  headerText?: (cell: HeaderCell) => ReactNode;
}

const plateDefaultStyles: CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

export const WellPlateInternal: FunctionComponent<IWellPlateInternalProps> = (
  props,
) => {
  const { displayAsGrid = false } = props;

  if (!displayAsGrid) {
    return <DefaultWellPlateInternal {...props} />;
  }

  return <GridWellPlateInternal {...props} />;
};

function GridWellPlateInternal(
  props: Omit<IWellPlateInternalProps, 'displayAsGrid'>,
) {
  const { plate } = props;

  const columnLabels = plate.columnLabels;
  const rowLabels = plate.rowLabels;

  const cellStyle: CSSProperties = {
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
  };

  const values: Array<{
    index: number;
    label: string;
    isHeader: boolean;
    position: { row: number; column: number };
  }> = [];

  for (let i = 0; i <= rowLabels.length - 1; i++) {
    values.push({
      index: undefined,
      label: rowLabels[i],
      isHeader: true,
      position: { column: -1, row: i },
    });

    for (let j = 0; j <= columnLabels.length - 1; j++) {
      const position = { row: i, column: j };
      const index = plate.getPosition(position, 'index');

      values.push({
        index,
        label: plate.getPosition(position, 'formatted'),
        isHeader: false,
        position,
      });
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `max-content repeat(${columnLabels.length}, 1fr)`,
        gridTemplateRows: `max-content repeat(${rowLabels.length}, 1fr)`,
        ...plateDefaultStyles,
        ...cellStyle,
      }}
    >
      {[
        {
          index: undefined,
          label: '',
          isHeader: true,
          position: { row: -1, column: -1 },
        },
        ...columnLabels.map((value, index) => {
          return {
            index: undefined,
            label: value,
            isHeader: true,
            position: {
              row: -1,
              column: index,
            },
          };
        }),
        ...values,
      ].map(({ index, label, isHeader, position }, mapIndex) => {
        if (isHeader) {
          const headerCell: HeaderCell = {
            label,
            position,
          };

          const renderHeader = props.headerText?.(headerCell);

          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`header-${label}-${mapIndex}`}
              className={props.headerClassName?.(headerCell)}
              style={{
                ...cellStyle,
                ...props.headerStyle?.(headerCell),
                padding: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {renderHeader === undefined ? label : renderHeader}
            </div>
          );
        }

        const renderText = props.text?.(index);

        return (
          <div
            style={{
              padding: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ...cellStyle,
              ...props.wellStyle(index),
            }}
            key={index}
            className={props.wellClassName(index)}
            onClick={props.onClick && ((e) => props.onClick(index, e))}
            onMouseEnter={props.onEnter && ((e) => props.onEnter(index, e))}
            onMouseLeave={props.onLeave && ((e) => props.onLeave(index, e))}
            onMouseUp={props.onMouseUp && ((e) => props.onMouseUp(index, e))}
            onMouseDown={
              props.onMouseDown && ((e) => props.onMouseDown(index, e))
            }
          >
            <div>{renderText === undefined ? label : renderText}</div>
          </div>
        );
      })}
    </div>
  );
}

function DefaultWellPlateInternal(
  props: Omit<IWellPlateInternalProps, 'displayAsGrid'>,
) {
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
    ...plateDefaultStyles,
  };

  const headerColumnLabels = columnLabels.map((columnLabel, index) => (
    <div
      key={columnLabel}
      style={{
        ...headerStyle,
        ...props.headerStyle?.({
          label: columnLabel,
          position: {
            column: index,
            row: -1,
          },
        }),
      }}
    >
      {columnLabel}
    </div>
  ));

  const rows = rowLabels.map((rowLabel, rowIdx) => {
    const columns = columnLabels.map((columnLabel, columnIdx) => {
      const index = plate.getPosition(
        { row: rowIdx, column: columnIdx },
        'index',
      );

      return (
        <div key={columnLabel} style={wellStyle}>
          <Well
            wellPlate={plate}
            className={props.wellClassName?.(index)}
            style={props.wellStyle?.(index)}
            onClick={props.onClick}
            onEnter={props.onEnter}
            onLeave={props.onLeave}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            text={props.text}
            value={index}
            size={wellSize}
          />
        </div>
      );
    });

    return (
      <div key={rowLabel} style={rowStyle}>
        <div
          style={{
            ...headerStyle,
            ...props.headerStyle?.({
              label: rowLabel,
              position: {
                column: -1,
                row: rowIdx,
              },
            }),
          }}
        >
          {rowLabel}
        </div>
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
}
