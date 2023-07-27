import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { KeywordAtom } from "module/list/recoil";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";

const Filter = () => {
  const setKeywordAtom = useSetRecoilState(KeywordAtom);
  const onChangeInput = useCallback(
    (e) => {
      setKeywordAtom(e.target.value);
    },
    [setKeywordAtom]
  );
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Input
        placeholder="Tìm kiếm"
        prefix={<SearchOutlined />}
        size="sm"
        onChange={(e) => onChangeInput(e)}
      />
      <Button>Bộ lọc</Button>
      <Button type="primary">Thêm mới</Button>
    </div>
  );
};

export default Filter;
