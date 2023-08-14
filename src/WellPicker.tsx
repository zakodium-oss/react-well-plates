import React, {
  CSSProperties,
  FunctionComponent,
  useMemo,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { WellPlate, PositionFormat, SubsetMode } from 'well-plates';

import { Cell } from './WellPlate';
import { WellPlateInternal } from './util/WellPlateInternal';

export type RangeSelectionMode = 'zone' | 'columns' | 'rows' | 'off';

interface PickCell extends Cell {
  disabled: boolean;
  booked: boolean;
  selected: boolean;
}

type ClassNameParam = (cell: PickCell) => string;
type StyleParam = (cell: PickCell) => CSSProperties;

const defaultWellStyles: CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  cursor: 'default',
};

const defaultWellPickerStyle: StyleParam = ({ booked, disabled, selected }) => {
  const styles: CSSProperties = {
    borderColor: 'black',
  };
  if (booked) {
    styles.borderColor = 'orange';
  }
  if (disabled) {
    styles.backgroundColor = 'lightgray';
  }
  if (selected) {
    styles.backgroundColor = 'lightgreen';
  }
  return styles;
};

export interface IWellPickerProps {
  displayAsGrid?: boolean;
  wellSize?: number;
  rows: number;
  columns: number;
  format?: PositionFormat;
  value: Array<number | string>;
  disabled?: Array<number | string>;
  onChange: (value: number[], label: string[]) => void;
  style?: StyleParam;
  className?: ClassNameParam;
  renderText?: (cell: PickCell) => ReactNode;
  rangeSelectionMode?: RangeSelectionMode;
  pickMode?: boolean;
}

export const MultiWellPicker: FunctionComponent<IWellPickerProps> = ({
  rows,
  columns,
  format,
  value,
  renderText: text = ({ label }) => label,
  disabled = [],
  onChange,
  style = defaultWellPickerStyle,
  className,
  rangeSelectionMode = 'zone',
  pickMode = true,
  ...wellPlateProps
}) => {
  const wellPlate = useMemo(() => {
    return new WellPlate({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);
  const valueSet = useMemo(() => {
    return new Set(value.map((label) => wellPlate.getPosition(label, 'index')));
  }, [value, wellPlate]);
  const disabledSet = useMemo(() => {
    return new Set(
      disabled.map((label) => wellPlate.getPosition(label, 'index')),
    );
  }, [disabled, wellPlate]);
  const [startWell, setStartWell] = useState<number | null>(null);
  const [bookedSet, setBooked] = useState(new Set<number>());

  const selectRange = useCallback(
    (start: number, end: number) => {
      let range: number[];
      switch (rangeSelectionMode) {
        case 'zone': {
          range = wellPlate.getPositionSubset(
            start,
            end,
            SubsetMode.zone,
            'index',
          );
          break;
        }
        case 'columns':
        case 'rows': {
          range = wellPlate.getPositionSubset(
            start,
            end,
            rangeSelectionMode === 'columns'
              ? SubsetMode.columns
              : SubsetMode.rows,
            'index',
          );

          break;
        }
        case 'off': {
          return;
        }
        default: {
          throw new Error('invalid range selection mode');
        }
      }

      setBooked(new Set(range));
    },
    [rangeSelectionMode, wellPlate],
  );

  const bookSelection = useCallback(
    (toggle) => {
      // if there is no selection, do nothing
      if (bookedSet.size === 0) return;
      const newValue = [];
      for (const bookedEl of bookedSet) {
        if (!disabledSet.has(wellPlate.getPosition(bookedEl, 'index'))) {
          if (toggle) {
            if (!valueSet.has(bookedEl)) {
              newValue.push(bookedEl);
            }
          } else {
            newValue.push(bookedEl);
          }
        }
      }

      if (toggle) {
        for (const selected of valueSet) {
          if (!bookedSet.has(selected)) {
            newValue.push(selected);
          }
        }
      }
      onChange(
        newValue,
        newValue.map((val) => wellPlate.getPosition(val, 'formatted')),
      );
    },
    [bookedSet, onChange, disabledSet, valueSet, wellPlate],
  );

  const toggleWell = useCallback(
    (well: number) => {
      if (valueSet.has(well)) {
        const valueSetCopy = new Set(valueSet);
        valueSetCopy.delete(well);
        const newValue = Array.from(valueSetCopy);
        onChange(
          newValue,
          newValue.map((val) => wellPlate.getPosition(val, 'formatted')),
        );
      } else if (disabledSet.has(well)) {
        // ignore
      } else {
        const newValue = [...valueSet, well];
        onChange(
          newValue,
          newValue.map((val) => wellPlate.getPosition(val, 'formatted')),
        );
      }
    },
    [valueSet, onChange, disabledSet, wellPlate],
  );

  const classNameCallback = useCallback<(index: number) => string>(
    (index) => {
      if (className) {
        return className({
          booked: bookedSet.has(index),
          disabled: disabledSet.has(index),
          selected: valueSet.has(index),
          label: wellPlate.getPosition(index, 'formatted'),
          position: wellPlate.getPosition(index, 'row_column'),
          index,
          wellPlate,
        });
      }
    },
    [valueSet, bookedSet, disabledSet, className, wellPlate],
  );

  const textCallback = useCallback<(index: number) => ReactNode>(
    (index) => {
      const label = wellPlate.getPosition(index, 'formatted');
      return text({
        index,
        label,
        wellPlate,
        booked: bookedSet.has(index),
        position: wellPlate.getPosition(index, 'row_column'),
        selected: valueSet.has(index),
        disabled: disabledSet.has(index),
      });
    },
    [text, wellPlate, bookedSet, valueSet, disabledSet],
  );

  const styleCallback = useCallback<(index: number) => CSSProperties>(
    (index) => {
      return {
        ...defaultWellStyles,
        ...style?.({
          booked: bookedSet.has(index),
          disabled: disabledSet.has(index),
          selected: valueSet.has(index),
          index,
          label: wellPlate.getPosition(index, 'formatted'),
          position: wellPlate.getPosition(index, 'row_column'),
          wellPlate,
        }),
      };
    },
    [disabledSet, bookedSet, valueSet, style, wellPlate],
  );

  const clear = useCallback(
    (event) => {
      if (event.shiftKey || isCtrlKey(event)) {
        bookSelection(true);
      } else {
        bookSelection(false);
      }
      setStartWell(null);
      setBooked(new Set());
    },
    [bookSelection],
  );

  useEffect(() => {
    window.addEventListener('mouseup', clear);
    window.addEventListener('mouseleave', clear);
    return () => {
      window.removeEventListener('mouseup', clear);
      window.removeEventListener('mouseleave', clear);
    };
  }, [clear]);

  return (
    <WellPlateInternal
      {...wellPlateProps}
      plate={wellPlate}
      wellStyle={styleCallback}
      wellClassName={classNameCallback}
      text={textCallback}
      onEnter={(well) => {
        if (startWell !== null) {
          selectRange(startWell, well);
        }
      }}
      onLeave={(well) => {
        if (startWell === well) {
          selectRange(well, well);
        }
      }}
      onMouseDown={(well, event) => {
        // if (disabledSet.has(wellPlate.getIndex(well))) return;
        setStartWell(well);
        if (!event.shiftKey && !isCtrlKey(event)) {
          if (!disabledSet.has(wellPlate.getPosition(well, 'index'))) {
            onChange([well], [wellPlate.getPosition(well, 'formatted')]);
          } else {
            onChange([], []);
          }
        }
      }}
      onClick={(well, e) => {
        if (e.shiftKey || isCtrlKey(e)) {
          if (pickMode) {
            toggleWell(well);
            e.stopPropagation();
          }
        }
      }}
    />
  );
};

function isCtrlKey(event: React.MouseEvent) {
  if (navigator.platform === 'MacIntel') {
    return event.metaKey;
  } else {
    return event.ctrlKey;
  }
}
