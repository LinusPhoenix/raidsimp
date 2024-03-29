import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

export interface LinkProps extends MuiLinkProps {
    readonly to: string;
}

/**
 * This component has the behaviour of the `react-router` link and the styling of the `material-ui` link.
 */
export function Link(props: LinkProps) {
    return <MuiLink component={RouterLink} underline="hover" {...props}></MuiLink>;
}
