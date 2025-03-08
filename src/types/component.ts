export type ComponentType = 
  | 'button' 
  | 'text' 
  | 'input' 
  | 'card' 
  | 'image' 
  | 'navbar' 
  | 'form';

export interface ComponentStyle {
  position?: string;
  left?: string;
  top?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  color?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  padding?: string;
  margin?: string;
  [key: string]: string | undefined;
}

export interface ComponentProps {
  style: ComponentStyle;
  className: string;
  children?: string | React.ReactNode;
  placeholder?: string;
  src?: string;
  alt?: string;
  [key: string]: any;
}

export interface Component {
  id: string;
  type: ComponentType;
  props: ComponentProps;
}

