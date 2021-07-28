import React from "react";
import {
    Toolbar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Drawer,
    AppBar,
    Typography,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { RaidTeamPage } from "./pages/RaidTeam";
import { RaidTeamsPage } from "./pages/RaidTeams";
import { RaiderPage } from "./pages/Raider";
import { Link } from "./components/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import clsx from "clsx";
import * as R from "./pages/routes";

const DRAWER_WIDTH = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    drawer: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
    },
    drawerPaper: {
        width: DRAWER_WIDTH,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -DRAWER_WIDTH,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

interface ADrawerProps {
    readonly isOpen: boolean;
    readonly closeDrawer: () => void;
}

function ADrawer(props: ADrawerProps) {
    const classes = useStyles();
    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={props.isOpen}
            classes={{ paper: classes.drawerPaper }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={props.closeDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem>
                    <ListItemText primary={<Link to={R.home()}>Home</Link>} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={<Link to={R.raidTeams()}>Raid teams</Link>} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem>
                    <ListItemText primary={<Link to="/💩">💩</Link>} />
                </ListItem>
            </List>
        </Drawer>
    );
}

export function App() {
    const [isOpen, setOpen] = React.useState(true);
    const classes = useStyles();
    return (
        <Router>
            <div className={classes.root}>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: isOpen,
                    })}
                >
                    <Toolbar>
                        {!isOpen && (
                            <IconButton
                                color="inherit"
                                onClick={() => setOpen(true)}
                                edge="start"
                                className={classes.menuButton}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Link to="/" variant="h6" color="inherit">
                            Wow Raid Manager
                        </Link>
                    </Toolbar>
                </AppBar>
                <nav>
                    <ADrawer isOpen={isOpen} closeDrawer={() => setOpen(false)} />
                </nav>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: isOpen,
                    })}
                >
                    <div className={classes.drawerHeader} />
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route
                            path="/raid-teams/:teamId/raiders/:raiderId"
                            render={({ match }) => (
                                <RaiderPage
                                    teamId={match.params.teamId}
                                    raiderId={match.params.raiderId}
                                />
                            )}
                        />
                        <Route
                            path="/raid-teams/:teamId"
                            render={({ match }) => <RaidTeamPage teamId={match.params.teamId} />}
                        />
                        <Route path="/raid-teams">
                            <RaidTeamsPage />
                        </Route>
                        <Route path="*">
                            <NotFoundPage />
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    );
}
