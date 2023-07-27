import Filter from "./subs/filter/filter";
import TableComponent from "./subs/table";

const List = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: 24, fontWeight: 600 }}>Quản lý sách</p>
        <Filter />
      </div>
      <TableComponent />
    </div>
  );
};

export default List;
