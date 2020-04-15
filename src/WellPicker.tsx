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

export enum RangeSelectionMode {
  rangeByRow,
  rangeByColumn,
  zone,
  off,
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

export interface IWellPickerProps {
  wellSize?: number;
  rows: number;
  columns: number;
  format?: PositionFormat;
  value: (number | string)[];
  disabled?: (number | string)[];
  onChange: (value: number[], label: string[]) => void;
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
  rangeSelectionMode?: RangeSelectionMode;
  pickMode?: boolean;
}

function getOrCallClassName(
  fnOrObj: ClassNameParam,
  value: number,
  wellPlate: WellPlate,
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
  wellPlate: WellPlate,
): CSSProperties {
  const label = wellPlate.getPositionCode(value);
  if (typeof fnOrObj === 'function') {
    return fnOrObj(value, label, wellPlate);
  }
  return fnOrObj;
}

const MultiWellPicker: FunctionComponent<IWellPickerProps> = ({
  rows,
  columns,
  format,
  value,
  text = (val, label) => label,
  disabled = [],
  onChange,
  style = defaultWellPickerStyle,
  className = {},
  rangeSelectionMode = RangeSelectionMode.zone,
  pickMode = true,
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
        const newValue = Array.from(valueSet);
        newValue.splice(well, 1);
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
    ],
  );

  const textCallback = useCallback(
    (val: number) => {
      const label = wellPlate.getPositionCode(val);
      return text(val, label, wellPlate);
    },
    [text, wellPlate],
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
    ],
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
