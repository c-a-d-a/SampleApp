import * as React from "react";
import {
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
  Button,
  Alignment,
  Intent
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import * as commonStyles from "../../common.module.css";
import * as styles from "./singleSelect.module.css";

export interface ISingleSelectProps<T> {
  items: T[];
  selectedItem: T | null;
  isRequired?: boolean;
  placeholder?: string;
  keySelector: (item: T) => any;
  getTextDisplay: (item: T) => string;
  onSelectedItemChanged: (item: T | null) => void;
}

export class SingleSelect<T> extends React.PureComponent<
  ISingleSelectProps<T>,
  object
> {
  public render() {
    const {
      selectedItem,
      isRequired,
      placeholder,
      keySelector,
      getTextDisplay
    } = this.props;
    const hasSelectedItem = selectedItem !== null;

    return (
      <Popover
        interactionKind={PopoverInteractionKind.CLICK}
        position={Position.BOTTOM}
        content={
          <Menu className={styles.singleSelectMenuItem}>
            {this.props.items.map((item: T, i: number) => {
              return (
                <MenuItem
                  key={keySelector(item)}
                  text={getTextDisplay(item)}
                  icon={
                    this.isItemSelected(item) ? IconNames.TICK : IconNames.BLANK
                  }
                  onClick={this.onItemClicked(item)}
                />
              );
            })}
          </Menu>
        }
        target={
          <Button
            className={styles.singleSelectContainer}
            rightIcon={IconNames.CARET_DOWN}
            alignText={Alignment.LEFT}
            icon={
              isRequired && !hasSelectedItem ? (
                IconNames.ERROR
              ) : (
                <React.Fragment />
              )
            }
            intent={
              isRequired && !hasSelectedItem ? Intent.DANGER : Intent.NONE
            }
            minimal={true}
            text={
              selectedItem !== null ? (
                getTextDisplay(selectedItem)
              ) : (
                <span className={commonStyles.inputPlaceholder}>
                  {placeholder ? placeholder : "Select..."}
                </span>
              )
            }
          />
        }
      />
    );
  }

  private onItemClicked = (item: T) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      let selectedItem = null;
      if (!this.isItemSelected(item)) {
        selectedItem = item;
      }
      this.props.onSelectedItemChanged(selectedItem);
    };
  };

  private isItemSelected = (item: T) => {
    return this.props.selectedItem === item;
  };
}
