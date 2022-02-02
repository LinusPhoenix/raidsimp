import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@material-ui/core";

export interface RefreshDataDialogProps {
    readonly refreshData: () => void;
    readonly handleClose: () => void;
    readonly isOpen: boolean;
}

export function RefreshDataDialog({
    refreshData,
    handleClose,
    isOpen,
}: RefreshDataDialogProps): JSX.Element {
    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Manually refresh raider data?</DialogTitle>
            <DialogContent>
                <Typography>
                    The character data is never older than 12 hours. Please don't manually refresh
                    the data unless you know it has changed since then.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        refreshData();
                        handleClose();
                    }}
                >
                    Refresh
                </Button>
            </DialogActions>
        </Dialog>
    );
}
