import { Button as BaseButton, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { loading?: boolean }
>(({ children, loading, ...props }, ref) => {
  if (loading) {
    props.disabled = true;
    children = (
      <>
        <Loader2 className="animate-spin" />
        {children}
      </>
    );
  }

  return (
    <BaseButton {...props} ref={ref}>
      {children}
    </BaseButton>
  );
});

export { Button };
