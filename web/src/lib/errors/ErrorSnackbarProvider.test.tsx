import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorSnackbarProvider } from "./ErrorSnackbarProvider";
import { useErrorHandler } from "./useErrorHandler";
import { AppError } from "./AppError";
import { ErrorCode } from "./codes";

function TriggerButton({
  onClickPayload,
}: {
  onClickPayload: () => unknown;
}) {
  const { showError } = useErrorHandler();
  return (
    <button
      type="button"
      onClick={() => {
        showError(onClickPayload());
      }}
    >
      disparar
    </button>
  );
}

describe("ErrorSnackbarProvider", () => {
  it("exibe a mensagem em português ao receber um AppError", async () => {
    const user = userEvent.setup();
    render(
      <ErrorSnackbarProvider onError={() => undefined}>
        <TriggerButton
          onClickPayload={() => new AppError(ErrorCode.PERMISSION_DENIED)}
        />
      </ErrorSnackbarProvider>,
    );

    await user.click(screen.getByRole("button", { name: "disparar" }));

    expect(
      await screen.findByText(/permissão para realizar esta ação/i),
    ).toBeInTheDocument();
  });

  it("traduz erro do Firebase ao exibir no snackbar", async () => {
    const user = userEvent.setup();
    render(
      <ErrorSnackbarProvider onError={() => undefined}>
        <TriggerButton
          onClickPayload={() => ({
            code: "auth/invalid-credential",
            message: "raw",
          })}
        />
      </ErrorSnackbarProvider>,
    );

    await user.click(screen.getByRole("button", { name: "disparar" }));

    expect(
      await screen.findByText(/email ou senha incorretos/i),
    ).toBeInTheDocument();
  });

  it("aciona o callback onError com o AppError traduzido", async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    render(
      <ErrorSnackbarProvider onError={onError}>
        <TriggerButton onClickPayload={() => new Error("falha qualquer")} />
      </ErrorSnackbarProvider>,
    );

    await user.click(screen.getByRole("button", { name: "disparar" }));

    expect(onError).toHaveBeenCalledOnce();
    const [arg] = onError.mock.calls[0];
    expect(AppError.is(arg)).toBe(true);
    expect((arg as AppError).code).toBe(ErrorCode.UNKNOWN);
  });
});
