import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

export interface ConfirmationDialogProps {
    readonly title: string;
    readonly body: string;
    readonly okButtonText: string;
    readonly performAction: () => void;
    readonly handleClose: () => void;
    readonly isOpen: boolean;
    readonly isDeleteAction?: boolean;
}

export function ConfirmationDialog({
    title,
    body,
    okButtonText,
    performAction,
    handleClose,
    isOpen,
    isDeleteAction,
}: ConfirmationDialogProps): JSX.Element {
    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{body}</Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color={isDeleteAction ? "danger" : "primary"}
                    onClick={() => {
                        performAction();
                        handleClose();
                    }}
                >
                    {okButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
