import { forwardRef, useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
  Tooltip,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

type PasswordFieldProps = Omit<TextFieldProps, "type">;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(props, ref) {
    const [visible, setVisible] = useState(false);
    const toggleLabel = visible ? "Ocultar senha" : "Mostrar senha";

    return (
      <TextField
        {...props}
        inputRef={ref}
        type={visible ? "text" : "password"}
        slotProps={{
          ...props.slotProps,
          input: {
            ...(props.slotProps?.input ?? {}),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={toggleLabel}>
                  <IconButton
                    aria-label={toggleLabel}
                    onClick={() => setVisible((current) => !current)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {visible ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
      />
    );
  },
);
