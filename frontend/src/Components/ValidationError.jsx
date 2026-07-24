function ValidationError({ children, id }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-500">
      {children}
    </p>
  );
}

export default ValidationError;
