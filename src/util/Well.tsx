import React, {
  ReactNode,
  CSSProperties,
  FunctionComponent,
  SyntheticEvent,
} from 'react';
import { WellPlate } from 'well-plates';

interface IWellProps {
  size: number;
  value: number;
  wellPlate: WellPlate;
  text?: (index: number) => ReactNode;
  onClick?: (value: number, e: React.MouseEvent) => void;
  onEnter?: (value: number, e: SyntheticEvent) => void;
  onLeave?: (value: number, e: SyntheticEvent) => void;
  onMouseUp?: (value: number, e: React.MouseEvent) => void;
  onMouseDown?: (value: number, e: React.MouseEvent) => void;
  style?: CSSProperties;
  className?: string;
}

const wellStyle: CSSProperties = {
  borderRadius: '50%',
  borderWidth: 1,
  borderStyle: 'solid',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
};

const Well: FunctionComponent<IWellProps> = (props) => {
  const { size, style: customStyles } = props;

  const wellMargin = Math.round(size / 12);
  const style = {
    ...wellStyle,
    width: size - 2 * wellMargin,
    height: size - 2 * wellMargin,
    margin: wellMargin,
    ...customStyles,
  };

  const displayableValue = props.text(props.value);

  return (
    <div
      onClick={props.onClick && ((e) => props.onClick(props.value, e))}
      onMouseEnter={props.onEnter && ((e) => props.onEnter(props.value, e))}
      onMouseLeave={props.onLeave && ((e) => props.onLeave(props.value, e))}
      onMouseUp={props.onMouseUp && ((e) => props.onMouseUp(props.value, e))}
      onMouseDown={
        props.onMouseDown && ((e) => props.onMouseDown(props.value, e))
      }
      className={props.className}
      style={style}
    >
      <div style={{ width: '100%' }}>
        {displayableValue === undefined
          ? props.wellPlate.getPosition(props.value, 'formatted')
          : displayableValue}
      </div>
    </div>
  );
};

export default Well;
