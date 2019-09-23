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
import { WellPlateInternal } from './WellPlate';

export enum MultiSelectionMode {
  rangeByRow,
  rangeByColumn,
  zone,
}

type ClassNameParam =
  | ((value: number, label: string, wellPlate: WellPlate) => string)
  | string;

type StyleParam =
  | ((value: number, label: string, wellPlate: WellPlate) => CSSProperties)
  | CSSProperties;

const defaultWellPickerStyle = {
  default: { borderColor: 'black' },
  disabled: { backgroundColor: 'lightgray', borderColor: 'black' },
  booked: { borderColor: 'orange' },
  selected: { backgroundColor: 'lightgreen' },
};
export interface IMultiWellPickerProps {
  wellSize?: number;
  rows: number;
  columns: number;
  format?: PositionFormat;
  value: number[];
  disabled?: Array<string | number>;
  onChange: (value: number[]) => void;
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
  text?: (value: number, label: string, wellPlate: WellPlate) => ReactNode;
  multiSelectionMode?: MultiSelectionMode;
}

export interface ISingleWellPickerProps {
  wellSize?: number;
  rows: number;
  columns: number;
  format?: PositionFormat;
  value: number;
  text?: (value: number, label: string, wellPlate: WellPlate) => ReactNode;
  disabled?: Array<number | string>;
  onChange: (value: number) => void;
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
  text = (value, label) => label,
  disabled = [],
  onChange,
  style = defaultWellPickerStyle,
  className = {},
}) => {
  style = Object.assign({}, defaultWellPickerStyle, style);
  const wellPlate = useMemo(() => {
    return new WellPlate({ rows, columns, positionFormat: format });
  }, [rows, columns, format]);

  const disabledSet = useMemo(() => {
    return new Set(disabled.map((label) => wellPlate.getIndex(label)));
  }, [disabled, wellPlate]);

  const textCallback = useCallback(
    (value: number) => {
      const label = wellPlate.getPositionCode(value);
      return text(value, label, wellPlate);
    },
    [text, wellPlate]
  );

  const classNameCallback = useCallback(
    (label: number) => {
      if (disabledSet.has(wellPlate.getIndex(label))) {
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
      wellPlate,
    ]
  );

  const styleCallback = useCallback(
    (index: number) => {
      if (disabledSet.has(index)) {
        return getOrCallStyle(style.disabled, index, wellPlate);
      } else if (value === index) {
        return getOrCallStyle(style.selected, index, wellPlate);
      } else {
        return getOrCallStyle(style.default, index, wellPlate);
      }
    },
    [
      disabledSet,
      value,
      style.disabled,
      style.selected,
      style.default,
      wellPlate,
    ]
  );

  const toggleWell = useCallback(
    (index: number) => {
      if (index === value) {
        onChange(null);
      } else if (disabledSet.has(index)) {
        return;
      } else {
        onChange(index);
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
  value: number,
  wellPlate: WellPlate
): string {
  const label = wellPlate.getPositionCode(value);
  if (typeof fnOrObj === 'function') {
    return fnOrObj(value, label, wellPlate);
  }
  return fnOrObj;
}

function getOrCallStyle(
  fnOrObj: StyleParam,
  value: number,
  wellPlate: WellPlate
): CSSProperties {
  const label = wellPlate.getPositionCode(value);
  if (typeof fnOrObj === 'function') {
    return fnOrObj(value, label, wellPlate);
  }
  return fnOrObj;
}

const MultiWellPicker: FunctionComponent<IMultiWellPickerProps> = ({
  rows,
  columns,
  format,
  value,
  text = (value, label) => label,
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
      setBooked(new Set(range.map((label) => wellPlate.getIndex(label))));
    },
    [multiSelectionMode, wellPlate]
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
      onChange(newValue);
    },
    [bookedSet, onChange, disabledSet, valueSet, wellPlate]
  );

  const toggleWell = useCallback(
    (well: number) => {
      if (valueSet.has(well)) {
        const newValue = Array.from(valueSet);
        newValue.splice(well, 1);
        onChange(newValue);
      } else if (disabledSet.has(well)) {
        return;
      } else {
        onChange([...valueSet, well]);
      }
    },
    [valueSet, onChange, disabledSet]
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
      wellPlate,
    ]
  );

  const textCallback = useCallback(
    (value: number) => {
      const label = wellPlate.getPositionCode(value);
      return text(value, label, wellPlate);
    },
    [text, wellPlate]
  );

  const styleCallback = useCallback(
    (index: number) => {
      if (disabledSet.has(index)) {
        return getOrCallStyle(style.disabled, index, wellPlate);
      } else if (bookedSet.has(index)) {
        return getOrCallStyle(style.booked, index, wellPlate);
      } else if (valueSet.has(index)) {
        return getOrCallStyle(style.selected, index, wellPlate);
      } else {
        return getOrCallStyle(style.default, index, wellPlate);
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
      wellPlate,
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
        if (disabledSet.has(wellPlate.getIndex(well))) return;
        setStartWell(well);
        if (!event.shiftKey && !event.ctrlKey) {
          if (!disabledSet.has(wellPlate.getIndex(well))) {
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
