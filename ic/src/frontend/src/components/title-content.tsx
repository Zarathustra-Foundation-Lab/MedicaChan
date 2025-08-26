"use client";

import { Button } from "@/components/ui/button";

export const TitleContent = ({
  title,
  description,
  btnText,
  btnOnClick,
  btnIcon,
}: {
  title: string;
  description?: string;
  btnText?: string;
  btnOnClick?: () => void;
  btnIcon?: React.ReactNode;
}) => {
  return (
    <div className="bg-muted/50 border-b p-4 flex items-center justify-between gap-5">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {btnOnClick && (
        <Button onClick={btnOnClick}>
          {btnIcon && btnIcon} {btnText}
        </Button>
      )}
    </div>
  );
};
