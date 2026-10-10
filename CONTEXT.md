# perfect-gui

A small library that lets developers build a floating panel of inputs bound to properties of their own objects.

## Language

**Panel**:
The root, floating GUI window created by the developer. It is the only Container that can have an `onUpdate` callback.
_Avoid_: GUI (as a domain word), root, window

**Container**:
Anything that can hold Components: a Panel, a Folder, or a Tab.
_Avoid_: Group, parent (as a noun for the type)

**Folder**:
A collapsible Container nested inside another Container.
_Avoid_: Group, section

**Tabs**:
A set of Tabs displayed together, one active at a time.
_Avoid_: Tab bar, tab group

**Tab**:
One pane of a Tabs set, itself a Container.
_Avoid_: Tab pane, page

**Component**:
Anything added to a Container: Slider, Toggle, Text, Button, etc. Not all Components control a value (e.g. DisplayText only displays).
_Avoid_: Controller, control, widget, input

## Events

**onUpdate**:
A Panel-level callback fired when the user changes any Component in the Panel's tree (drag, click, typing). Not fired by programmatic changes to the bound property, nor by readonly Components.
_Avoid_: change listener

**onChange**:
A per-Component callback fired whenever that Component's bound value changes, including programmatic changes.
_Avoid_: onUpdate (different scope and trigger)
