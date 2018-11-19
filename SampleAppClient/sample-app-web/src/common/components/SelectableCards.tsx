import * as React from "react";
import { Card, Elevation } from "@blueprintjs/core";

import * as styles from "./selectableCards.module.css";

export interface ISelectableCardsProps<T> {
  items: T[];
  selectedItem: T | null;
  keySelector: (item: T) => any;
  itemRenderer: (item: T) => React.ReactNode;
  onSelectedItemChanged: (item: T) => void;
}

export class SelectableCards<T> extends React.PureComponent<
  ISelectableCardsProps<T>,
  object
> {
  public render() {
    const { items, selectedItem, keySelector, itemRenderer } = this.props;

    return items.map((item, _) => {
      const isItemSelected = item === selectedItem;
      return (
        <Card
          key={keySelector(item)}
          className={
            isItemSelected
              ? styles.selectableCardsSelectedItemCard
              : styles.selectableCardsItemCard
          }
          interactive={true}
          elevation={isItemSelected ? Elevation.THREE : Elevation.ONE}
          onClick={this.onItemClicked(item)}
        >
          {itemRenderer(item)}
        </Card>
      );
    });
  }

  private onItemClicked = (item: T) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (this.props.selectedItem !== item) {
        this.props.onSelectedItemChanged(item);
      }
    };
  };
}
