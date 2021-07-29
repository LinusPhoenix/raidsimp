import React from "react";
import {
    Box,
    Toolbar,
    Divider,
    List,
    ListItem,
    ListItemText,
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Drawer as MuiDrawer,
    IconButton,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { RaidTeamPage } from "./pages/RaidTeam";
import { RaidTeamsPage } from "./pages/RaidTeams";
import { RaiderPage } from "./pages/Raider";
import { Link } from "./components/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import * as R from "./pages/routes";
import { useThemeToggle } from "./Theming";

const DRAWER_WIDTH = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "isOpen" })<{
    isOpen: boolean;
}>(({ theme, isOpen }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${DRAWER_WIDTH}px`,
    ...(isOpen && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    isOpen: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "isOpen",
})<AppBarProps>(({ theme, isOpen }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(isOpen && {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: `${DRAWER_WIDTH}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

interface DrawerProps {
    readonly isOpen: boolean;
    readonly closeDrawer: () => void;
}

function Drawer(props: DrawerProps) {
    return (
        <MuiDrawer
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    boxSizing: "border-box",
                },
            }}
            variant="persistent"
            anchor="left"
            open={props.isOpen}
        >
            <DrawerHeader>
                <IconButton onClick={props.closeDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
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
        </MuiDrawer>
    );
}

export function App() {
    const [isOpen, setOpen] = React.useState(true);
    const toggleTheme = useThemeToggle();
    console.log("a");
    return (
        <Router>
            <Box sx={{ display: "flex" }}>
                <AppBar position="fixed" isOpen={isOpen}>
                    <Toolbar>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <div>
                                {!isOpen && (
                                    <IconButton onClick={() => setOpen(true)}>
                                        <MenuIcon />
                                    </IconButton>
                                )}
                                <Link to="/" variant="h6" color="inherit">
                                    Wow Raid Manager
                                </Link>
                            </div>
                            <IconButton onClick={toggleTheme} color="inherit">
                                <InvertColorsIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <nav>
                    <Drawer isOpen={isOpen} closeDrawer={() => setOpen(false)} />
                </nav>
                <Main isOpen={isOpen}>
                    <Toolbar />
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
                </Main>
            </Box>
        </Router>
    );
}
