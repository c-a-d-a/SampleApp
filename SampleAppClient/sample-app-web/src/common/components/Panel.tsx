import * as React from "react";
import { Card, H4, Divider, Elevation } from "@blueprintjs/core";

import styles from "./panel.module.css";
import { concatClassNames } from "src/common/cssHelper";

export interface IPanelProps {
  className?: string;
  header: string | JSX.Element;
  children: JSX.Element;
}

export function Panel({
  className,
  header,
  children
}: IPanelProps): JSX.Element {
  const headerComponent =
    typeof header === "string" ? <H4>{header}</H4> : header;

  return (
    <Card
      className={concatClassNames(className, styles.panelCardContainer)}
      elevation={Elevation.THREE}
    >
      <div className={styles.panelHeader}>{headerComponent}</div>
      <Divider />
      <div className={styles.panelBody}>{children}</div>
    </Card>
  );
};

