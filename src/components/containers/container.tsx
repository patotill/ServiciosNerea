interface ContainerProps extends React.PropsWithChildren {
  direction?: "row" | "column";
  fullScreen?: boolean;
  gap?: string;
}

export default function Container({
  direction,
  fullScreen,
  gap,
  children,
}: ContainerProps) {
  const center =
    direction === "column" ? "items-center justify-center" : "items-center";
  return (
    <div
      className={`${fullScreen && "h-screen"} ${gap || "gap-2"} flex ${"flex" + direction} ${center}`}
    >
      {children}
    </div>
  );
}
