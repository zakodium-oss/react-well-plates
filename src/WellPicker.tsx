import React, {
  CSSProperties,
  FunctionComponent,
  useMemo,
  useState,
  useCallback,
  useEffect
} from 'react';
import { WellPlate, RangeMode, PositionFormat } from 'well-plates';
import { WellPlateInternal } from './WellPlate';

export enum MultiSelectionMode {
  rangeByRow,
  rangeByColumn,
  zone
}

const defaultWellPickerStyle = {
  default: { borderColor: 'black' },
  disabled: { backgroundColor: 'lightgray', borderColor: 'black' },
  booked: { borderColor: 'orange' },
  selected: { backgroundColor: 'lightgreen' }
};
export interface IMultiWellPickerProps {
  wellSize?: number;
  rows: number;
  columns: number;
  format?: PositionFormat;
  value: string[];
  disabled?: string[];
  onChange: (value: string[]) => void;
  style?: {
    selected?: CSSProperties;
    disabled?: CSSProperties;
    booked?: CSSProperties;
    default?: CSSProperties;
  };
  className?: {
    selected?: string;
    disabled?: string;
    booked?: string;
    default?: string;
  };
  multiSelectionMode?: MultiSelectionMode;
}

export interface ISingleWellPickerProps {
  wellSize?: number;
  rows: number;
  columns: number;
  format?: PositionFormat;
  value: string[];
  disabled?: string[];
  onChange: (value: string[]) => void;
  style?: {
    selected?: CSSProperties;
    disabled?: CSSProperties;
    default?: CSSProperties;
  };
  className?: {
    selected?: string;
    disabled?: string;
    default?: string;
  };
}

export const SingleWellPicker: FunctionComponent<ISingleWellPickerProps> = ({
  wellSize,
  rows,
  columns,
  format,
  value,
  disabled = [],
  onChange,
  style = defaultWellPickerStyle,
  className = {}
}) => {
  const wellPlate = useMemo(() => {
    return new WellPlate({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);

  const disabledSet = useMemo(() => {
    return new Set(disabled);
  }, [disabled]);

  const classNameCallback = useCallback(
    (label) => {
      if (disabledSet.has(label)) {
        return className.disabled;
      } else if (value === label) {
        return className.selected;
      } else {
        return className.default;
      }
    },
    [value, disabledSet, className]
  );

  const styleCallback = useCallback(
    (label) => {
      if (disabledSet.has(label)) {
        return style.disabled;
      } else if (value === label) {
        return style.selected;
      } else {
        return style.default;
      }
    },
    [value, disabledSet, style]
  );

  const toggleWell = useCallback(
    (well) => {
      if (well === value) {
        onChange(null);
      } else {
        onChange(well);
      }
    },
    [value, onChange]
  );

  return (
    <WellPlateInternal
      wellSize={wellSize}
      plate={wellPlate}
      wellStyle={styleCallback}
      wellClassName={classNameCallback}
      onClick={toggleWell}
    />
  );
};

const MultiWellPicker: FunctionComponent<IMultiWellPickerProps> = ({
  rows,
  columns,
  format,
  value,
  disabled = [],
  onChange,
  style = defaultWellPickerStyle,
  className = {},
  multiSelectionMode = MultiSelectionMode.zone,
  ...wellPlateProps
}) => {
  const wellPlate = useMemo(() => {
    return new WellPlate({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);
  const valueSet = useMemo(() => {
    return new Set(value);
  }, [value]);
  const disabledSet = useMemo(() => {
    return new Set(disabled);
  }, [disabled]);
  const [startWell, setStartWell] = useState(null);
  const [bookedSet, setBooked] = useState(new Set());

  const selectRange = useCallback(
    (start, end) => {
      let range;
      switch (multiSelectionMode) {
        case MultiSelectionMode.zone: {
          range = wellPlate.getPositionCodeZone(start, end);
          break;
        }
        case MultiSelectionMode.rangeByRow:
        case MultiSelectionMode.rangeByColumn: {
          range = wellPlate.getPositionCodeRange(
            start,
            end,
            multiSelectionMode === MultiSelectionMode.rangeByRow
              ? RangeMode.byRows
              : RangeMode.byColumns
          );
          break;
        }
        case MultiSelectionMode.rangeByColumn: {
          break;
        }
        default: {
          throw new Error('invalid multiSelectionMode');
        }
      }
      setBooked(new Set(range));
    },
    [multiSelectionMode, wellPlate]
  );

  const bookSelection = useCallback(
    (toggle) => {
      // if there is no selection, do nothing
      if (bookedSet.size === 0) return;
      const newValue = [];
      for (let bookedEl of bookedSet) {
        if (!disabledSet.has(bookedEl)) {
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
      onChange(newValue);
    },
    [bookedSet, onChange, disabledSet, valueSet]
  );

  const toggleWell = useCallback(
    (well) => {
      if (valueSet.has(well)) {
        const index = value.findIndex((val) => val === well);
        const newValue = Array.from(valueSet);
        newValue.splice(index, 1);
        onChange(newValue);
      } else {
        onChange([...valueSet, well]);
      }
    },
    [valueSet, value, onChange]
  );

  const classNameCallback = useCallback(
    (label) => {
      if (disabledSet.has(label)) {
        return className.disabled;
      } else if (bookedSet.has(label)) {
        return className.booked;
      } else if (valueSet.has(label)) {
        return className.selected;
      } else {
        return className.default;
      }
    },
    [valueSet, bookedSet, disabledSet, className]
  );

  const styleCallback = useCallback(
    (label) => {
      if (disabledSet.has(label)) {
        return style.disabled;
      } else if (bookedSet.has(label)) {
        return style.booked;
      } else if (valueSet.has(label)) {
        return style.selected;
      } else {
        return style.default;
      }
    },
    [valueSet, bookedSet, disabledSet, style]
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
    [bookSelection]
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
      onEnter={(well) => {
        if (startWell) {
          selectRange(startWell, well);
        }
      }}
      onLeave={(well) => {
        if (startWell === well) {
          selectRange(well, well);
        }
      }}
      onMouseDown={(well, event) => {
        if (disabledSet.has(well)) return;
        setStartWell(well);
        if (!event.shiftKey && !event.ctrlKey) {
          onChange([well]);
        }
      }}
      onClick={(well, e) => {
        if (e.shiftKey || e.ctrlKey) {
          toggleWell(well);
          e.stopPropagation();
        }
      }}
    />
  );
};

export default MultiWellPicker;
