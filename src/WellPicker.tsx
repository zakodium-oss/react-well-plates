import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { WellPlate } from 'well-plates';
import ReactWellPlate from './WellPlate';

export default function WellPicker({
  rows,
  columns,
  value,
  disabled,
  onSelect,
  style,
  className
}) {
  const wellPlate = useMemo(() => {
    return new WellPlate({ rows, columns });
  }, [rows, columns]);
  const valueSet = useMemo(() => {
    return new Set(value);
  }, [value]);
  const disabledSet = useMemo(() => {
    return new Set(disabled);
  }, [disabled]);
  const [startWell, setStartWell] = useState(null);
  const [bookedSet, setBooked] = useState(new Set());

  const selectRange = useCallback((start, end) => {
    const indexStart = wellPlate.getIndex(start);
    const indexEnd = wellPlate.getIndex(end);
    const size = indexEnd - indexStart;
    const range = wellPlate.getPositionCodeRange(
      size < 0 ? end : start,
      size < 0 ? -size + 1 : size + 1
    );
    setBooked(new Set(range));
  }, []);

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
      onSelect(newValue);
    },
    [disabled, bookedSet, onSelect]
  );

  const toggleWell = useCallback(
    (well) => {
      if (valueSet.has(well)) {
        const index = value.findIndex((val) => val === well);
        const newValue = Array.from(valueSet);
        newValue.splice(index, 1);
        onSelect(newValue);
      } else {
        onSelect([...valueSet, well]);
      }
    },
    [valueSet]
  );

  const classNameCallback = useCallback(
    (label) => {
      if (valueSet.has(label)) {
        return className.selected;
      } else if (disabledSet.has(label)) {
        return className.disabled;
      } else if (bookedSet.has(label)) {
        return className.booked;
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
    <ReactWellPlate
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
        setStartWell(well);
        if (!event.shiftKey && !event.ctrlKey) {
          onSelect([]);
        }
      }}
      onClick={(well, e) => {
        toggleWell(well);
        if (e.shiftKey || e.ctrlKey) {
          e.stopPropagation();
        }
      }}
    />
  );
}
