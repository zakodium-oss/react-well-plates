import React, {
  CSSProperties,
  FunctionComponent,
  useMemo,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from 'react';
import { WellPlate, RangeMode, PositionFormat } from 'well-plates';
import { WellPlateInternal } from './WellPlate';

export enum MultiSelectionMode {
  rangeByRow,
  rangeByColumn,
  zone
}

type ClassNameParam =
  | ((label: string, wellPlate: WellPlate) => string)
  | string;

type StyleParam =
  | ((label: string, wellPlate: WellPlate) => CSSProperties)
  | CSSProperties;

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
    selected?: StyleParam;
    disabled?: StyleParam;
    booked?: StyleParam;
    default?: StyleParam;
  };
  className?: {
    selected?: ClassNameParam;
    disabled?: ClassNameParam;
    booked?: ClassNameParam;
    default?: ClassNameParam;
  };
  text?: (label: string, wellPlate: WellPlate) => ReactNode;
  multiSelectionMode?: MultiSelectionMode;
}

export interface ISingleWellPickerProps {
  wellSize?: number;
  rows: number;
  columns: number;
  format?: PositionFormat;
  value: string[];
  text?: (label: string, wellPlate: WellPlate) => ReactNode;
  disabled?: string[];
  onChange: (value: string[]) => void;
  style?: {
    selected?: StyleParam;
    disabled?: StyleParam;
    default?: StyleParam;
  };
  className?: {
    selected?: ClassNameParam;
    disabled?: ClassNameParam;
    default?: ClassNameParam;
  };
}

export const SingleWellPicker: FunctionComponent<ISingleWellPickerProps> = ({
  wellSize,
  rows,
  columns,
  format,
  value,
  text,
  disabled = [],
  onChange,
  style = defaultWellPickerStyle,
  className = {}
}) => {
  style = Object.assign({}, defaultWellPickerStyle, style);
  const wellPlate = useMemo(() => {
    return new WellPlate({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);

  const disabledSet = useMemo(() => {
    return new Set(disabled);
  }, [disabled]);

  const textCallback = useCallback(
    (label: string) => {
      if (text) return text(label, wellPlate);
      return label;
    },
    [text, wellPlate]
  );

  const classNameCallback = useCallback(
    (label) => {
      if (disabledSet.has(label)) {
        return getOrCallClassName(className.disabled, label, wellPlate);
      } else if (value === label) {
        return getOrCallClassName(className.selected, label, wellPlate);
      } else {
        return getOrCallClassName(className.default, label, wellPlate);
      }
    },
    [
      value,
      disabledSet,
      className.disabled,
      className.selected,
      className.default,
      wellPlate
    ]
  );

  const styleCallback = useCallback(
    (label) => {
      if (disabledSet.has(label)) {
        return getOrCallStyle(style.disabled, label, wellPlate);
      } else if (value === label) {
        return getOrCallStyle(style.selected, label, wellPlate);
      } else {
        return getOrCallStyle(style.default, label, wellPlate);
      }
    },
    [
      disabledSet,
      value,
      style.disabled,
      style.selected,
      style.default,
      wellPlate
    ]
  );

  const toggleWell = useCallback(
    (well) => {
      if (well === value) {
        onChange(null);
      } else if (disabledSet.has(well)) {
        return;
      } else {
        onChange(well);
      }
    },
    [value, onChange, disabledSet]
  );

  return (
    <WellPlateInternal
      wellSize={wellSize}
      plate={wellPlate}
      wellStyle={styleCallback}
      wellClassName={classNameCallback}
      onClick={toggleWell}
      text={textCallback}
    />
  );
};

function getOrCallClassName(
  fnOrObj: ClassNameParam,
  label: string,
  wellPlate: WellPlate
): string {
  if (typeof fnOrObj === 'function') {
    return fnOrObj(label, wellPlate);
  }
  return fnOrObj;
}

function getOrCallStyle(
  fnOrObj: StyleParam,
  label: string,
  wellPlate: WellPlate
): CSSProperties {
  if (typeof fnOrObj === 'function') {
    return fnOrObj(label, wellPlate);
  }
  return fnOrObj;
}

const MultiWellPicker: FunctionComponent<IMultiWellPickerProps> = ({
  rows,
  columns,
  format,
  value,
  text,
  disabled = [],
  onChange,
  style = defaultWellPickerStyle,
  className = {},
  multiSelectionMode = MultiSelectionMode.zone,
  ...wellPlateProps
}) => {
  style = Object.assign({}, defaultWellPickerStyle, style);
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
      } else if (disabledSet.has(well)) {
        return;
      } else {
        onChange([...valueSet, well]);
      }
    },
    [valueSet, value, onChange, disabledSet]
  );

  const classNameCallback = useCallback(
    (label) => {
      if (disabledSet.has(label)) {
        return getOrCallClassName(className.disabled, label, wellPlate);
      } else if (bookedSet.has(label)) {
        return getOrCallClassName(className.booked, label, wellPlate);
      } else if (valueSet.has(label)) {
        return getOrCallClassName(className.selected, label, wellPlate);
      } else {
        return getOrCallClassName(className.default, label, wellPlate);
      }
    },
    [
      valueSet,
      bookedSet,
      disabledSet,
      className.disabled,
      className.booked,
      className.selected,
      className.default,
      wellPlate
    ]
  );

  const textCallback = useCallback(
    (label: string) => {
      if (text) return text(label, wellPlate);
      return label;
    },
    [text, wellPlate]
  );

  const styleCallback = useCallback(
    (label) => {
      if (disabledSet.has(label)) {
        return getOrCallStyle(style.disabled, label, wellPlate);
      } else if (bookedSet.has(label)) {
        return getOrCallStyle(style.booked, label, wellPlate);
      } else if (valueSet.has(label)) {
        return getOrCallStyle(style.selected, label, wellPlate);
      } else {
        return getOrCallStyle(style.default, label, wellPlate);
      }
    },
    [
      disabledSet,
      bookedSet,
      valueSet,
      style.disabled,
      style.booked,
      style.selected,
      style.default,
      wellPlate
    ]
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
      text={textCallback}
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
          if (!disabledSet.has(well)) {
            onChange([well]);
          } else {
            onChange([]);
          }
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
