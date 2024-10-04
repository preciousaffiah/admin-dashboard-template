const Container = ({ children }: any) => {
  return (
    <div className="authcard1">
      <div className="authcard2">
        <div className="authcard3 md:px-12 px-0">{children}</div>
      </div>
    </div>
  );
};

export default Container;
