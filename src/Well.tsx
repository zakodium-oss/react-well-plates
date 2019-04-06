import React, { ReactNode } from 'react';
import { CSSProperties, FunctionComponent, SyntheticEvent } from 'react';

interface IWellProps {
  size: number;
  value?: string;
  text?: ReactNode;
  onClick?: (label: string, e: React.MouseEvent) => void;
  onEnter?: (label: string, e: SyntheticEvent) => void;
  onLeave?: (label: string, e: SyntheticEvent) => void;
  onMouseUp?: (label: string, e: React.MouseEvent) => void;
  onMouseDown?: (label: string, e: React.MouseEvent) => void;
  style?: CSSProperties;
  className?: string;
}

const wellStyle: CSSProperties = {
  borderRadius: '50%',
  borderWidth: 1,
  borderStyle: 'solid',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center'
};

const Well: FunctionComponent<IWellProps> = (props) => {
  const { size, style: customStyles } = props;

  const wellMargin = Math.round(size / 12);
  const style = {
    ...wellStyle,
    width: size - 2 * wellMargin,
    height: size - 2 * wellMargin,
    margin: wellMargin,
    ...customStyles
  };

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
      <div style={{ width: '100%' }}>{props.text}</div>
    </div>
  );
};

export default Well;
