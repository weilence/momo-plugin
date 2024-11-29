import { FC } from "react";
import { Button as BaseButton, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

const Button: FC<ButtonProps & { loading?: boolean }> = ({
  children,
  loading,
  ...props
}) => {
  if (loading) {
    props.disabled = true;
    children = (
      <>
        <Loader2 className="animate-spin" />
        {children}
      </>
    );
  }

  return <BaseButton {...props}>{children}</BaseButton>;
};

export { Button };
