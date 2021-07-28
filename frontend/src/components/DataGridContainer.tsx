import React from "react";

const GRID_HEADER_HEIGHT = 56;
const GRID_ROW_HEIGHT = 52;
const GRID_FOOTER_HEIGHT = 52;
const GRID_PADDING = 2;

export interface DataGridContainerProps {
    readonly rowCount: number;
    readonly children: React.ReactNode;
}

/**
 * This component gives a DataGrid the correct height for its rowCount, and 100% width.
 */
export function DataGridContainer(props: DataGridContainerProps) {
    const height =
        GRID_HEADER_HEIGHT + GRID_ROW_HEIGHT * props.rowCount + GRID_FOOTER_HEIGHT + GRID_PADDING;
    return <div style={{ height: height, width: "100%" }}>{props.children}</div>;
}
