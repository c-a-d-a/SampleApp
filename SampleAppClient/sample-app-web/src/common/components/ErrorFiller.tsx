import * as React from "react";
import { Text } from "@blueprintjs/core";

import * as styles from "./errorFiller.module.css";

export interface IErrorFillerProps {
  errorMessage: string | null;
}

export function ErrorFiller({ errorMessage }: IErrorFillerProps) {
  if (errorMessage === null) {
    return <div className={styles.errorFillerEmptyContainer} />;
  } else {
    return (
      <div className={styles.errorFillerContainer}>
        <Text>{`Error: ${errorMessage}`}</Text>
      </div>
    );
  }
}
