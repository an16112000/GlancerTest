/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";

export const useRefPortal = <
  T extends
    | React.ForwardRefExoticComponent<any>
    | (new (props: any) => React.Component<any, object, any>)
    | ((props: any, context?: any) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null)
    | keyof JSX.IntrinsicElements,
>() => {
  return useRef<React.ElementRef<T>>(null);
};
