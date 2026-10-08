interface LinkTextProps {
  href: string;
  children: React.ReactNode;
}

export default function LinkText({ children, href }: LinkTextProps) {
  return (
    <a
      href="href"
      className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
    >
      {children}
    </a>
  );
}
