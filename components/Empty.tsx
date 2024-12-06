import { WholeWord } from "lucide-react";
import * as React from "react";

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

const Empty: React.FC<EmptyProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "flex min-h-[120px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center",
        className
      )}
      {...props}
    >
      {children || (
        <div>
          <WholeWord size={48} className="text-gray-400" />
          <p className="text-gray-400">No data</p>
        </div>
      )}
    </div>
  );
};

export { Empty };
