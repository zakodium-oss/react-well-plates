import React, {
  CSSProperties,
  FunctionComponent,
  useMemo,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { WellPlate, RangeMode, PositionFormat } from 'well-plates';

import { WellPlateInternal, Cell } from './WellPlate';

export enum RangeSelectionMode {
  rangeByRow,
  rangeByColumn,
  zone,
  off,
}

interface PickCell extends Cell {
  disabled: boolean;
  booked: boolean;
  selected: boolean;
}

type ClassNameParam = (cell: PickCell) => string;
type StyleParam = (cell: PickCell) => CSSProperties;

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
  wellSize?: number;
  rows: number;
  columns: number;
  format?: PositionFormat;
  value: (number | string)[];
  disabled?: (number | string)[];
  onChange: (value: number[], label: string[]) => void;
  style?: StyleParam;
  className?: ClassNameParam;
  text?: (cell: PickCell) => ReactNode;
  rangeSelectionMode?: RangeSelectionMode;
  pickMode?: boolean;
}

const MultiWellPicker: FunctionComponent<IWellPickerProps> = ({
  rows,
  columns,
  format,
  value,
  text = ({ label }) => label,
  disabled = [],
  onChange,
  style = defaultWellPickerStyle,
  className,
  rangeSelectionMode = RangeSelectionMode.zone,
  pickMode = true,
  ...wellPlateProps
}) => {
  const wellPlate = useMemo(() => {
    return new WellPlate({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);
  const valueSet = useMemo(() => {
    return new Set(value.map((label) => wellPlate.getIndex(label)));
  }, [value, wellPlate]);
  const disabledSet = useMemo(() => {
    return new Set(disabled.map((label) => wellPlate.getIndex(label)));
  }, [disabled, wellPlate]);
  const [startWell, setStartWell] = useState<number | null>(null);
  const [bookedSet, setBooked] = useState(new Set<number>());

  const selectRange = useCallback(
    (start: number, end: number) => {
      let range: string[];
      switch (rangeSelectionMode) {
        case RangeSelectionMode.zone: {
          range = wellPlate.getPositionCodeZone(start, end);
          break;
        }
        case RangeSelectionMode.rangeByRow:
        case RangeSelectionMode.rangeByColumn: {
          range = wellPlate.getPositionCodeRange(
            start,
            end,
            rangeSelectionMode === RangeSelectionMode.rangeByRow
              ? RangeMode.byRows
              : RangeMode.byColumns,
          );
          break;
        }
        case RangeSelectionMode.off: {
          return;
        }
        default: {
          throw new Error('invalid range selection mode');
        }
      }
      setBooked(new Set(range.map((label) => wellPlate.getIndex(label))));
    },
    [rangeSelectionMode, wellPlate],
  );

  const bookSelection = useCallback(
    (toggle) => {
      // if there is no selection, do nothing
      if (bookedSet.size === 0) return;
      const newValue = [];
      for (let bookedEl of bookedSet) {
        if (!disabledSet.has(wellPlate.getIndex(bookedEl))) {
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
        for (let selected of valueSet) {
          if (!bookedSet.has(selected)) {
            newValue.push(selected);
          }
        }
      }
      onChange(
        newValue,
        newValue.map((val) => wellPlate.getPositionCode(val)),
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
          newValue.map((val) => wellPlate.getPositionCode(val)),
        );
      } else if (disabledSet.has(well)) {
        return;
      } else {
        const newValue = [...valueSet, well];
        onChange(
          newValue,
          newValue.map((val) => wellPlate.getPositionCode(val)),
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
          label: wellPlate.getPositionCode(index),
          index,
          wellPlate,
        });
      }
    },
    [valueSet, bookedSet, disabledSet, className, wellPlate],
  );

  const textCallback = useCallback<(index: number) => ReactNode>(
    (index) => {
      const label = wellPlate.getPositionCode(index);
      return text({
        index,
        label,
        wellPlate,
        booked: bookedSet.has(index),
        selected: valueSet.has(index),
        disabled: disabledSet.has(index),
      });
    },
    [text, wellPlate, bookedSet, valueSet, disabledSet],
  );

  const styleCallback = useCallback<(index: number) => CSSProperties>(
    (index) => {
      if (style) {
        return style({
          booked: bookedSet.has(index),
          disabled: disabledSet.has(index),
          selected: valueSet.has(index),
          index: index,
          label: wellPlate.getPositionCode(index),
          wellPlate,
        });
      } else {
        return {};
      }
    },
    [disabledSet, bookedSet, valueSet, style, wellPlate],
  );

  const clear = useCallback(
    (event) => {
      if (event.shiftKey || event.ctrlKey) {
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
        if (disabledSet.has(wellPlate.getIndex(well))) return;
        setStartWell(well);
        if (!event.shiftKey && !event.ctrlKey) {
          if (!disabledSet.has(wellPlate.getIndex(well))) {
            onChange([well], [wellPlate.getPositionCode(well)]);
          } else {
            onChange([], []);
          }
        }
      }}
      onClick={(well, e) => {
        if (e.shiftKey || e.ctrlKey) {
          if (pickMode) {
            toggleWell(well);
            e.stopPropagation();
          }
        }
      }}
    />
  );
};

export default MultiWellPicker;
