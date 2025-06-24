// c:\Users\PC\Downloads\conceivin3d (2)\src\types\react-day-picker.d.ts

// This is a workaround for potential missing or mis-exported types
// in react-day-picker@9.0.0-beta.38.
// The correct type for the `components` prop is typically `DayPickerComponents`.
// If upgrading react-day-picker is an option, that's usually the preferred solution.

import * as React from 'react';

declare module 'react-day-picker' {
  // Declare the interface that seems to be missing or mis-exported
  export interface DayPickerComponents {
    Caption?: React.ComponentType<any>;
    CaptionLabel?: React.ComponentType<any>;
    CaptionLayout?: React.ComponentType<any>;
    Day?: React.ComponentType<any>;
    DayContent?: React.ComponentType<any>;
    DayHead?: React.ComponentType<any>;
    DayPicker?: React.ComponentType<any>;
    DayPickerProvider?: React.ComponentType<any>;
    Dropdown?: React.ComponentType<any>;
    Footer?: React.ComponentType<any>;
    Head?: React.ComponentType<any>;
    IconLeft?: React.ComponentType<any>; // Declare the component types you are overriding
    IconRight?: React.ComponentType<any>; // Declare the component types you are overriding
    Month?: React.ComponentType<any>;
    Months?: React.ComponentType<any>;
    // Add other component types if you override them
  }
}