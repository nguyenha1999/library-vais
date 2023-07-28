import { Button, Image, Rate, Table, Tag } from "antd";
import deleteImage from "assets/image/Delete.svg";
import editImage from "assets/image/Edit.svg";
import LoadingComponent from "component/loading";
import dayjs from "dayjs";
import { KeywordAtom } from "module/list/recoil";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import API from "util/api";
import { QUERY_LIST } from "util/const";
import { useDebounce } from "util/custom-hook";

const TableComponent = () => {
  const PAGE_SIZE = 10;

  const keyword = useRecoilValue(KeywordAtom);
  const keywordSearch = useDebounce(keyword);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState("");

  const { isLoading, data: dataSource } = useQuery(
    [QUERY_LIST, keywordSearch, page],
    () => {
      const config = {
        url: "api/books",
        params: {
          search: keywordSearch,
          page: page,
          limit: PAGE_SIZE,
        },
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        setTotal(data.total);
      },
    }
  );

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Mã sách",
      dataIndex: "book_id",
      key: "book_id",
      sorter: (a, b) => a.book_id - b.book_id,
      sortOrder: sortedInfo.columnKey === "book_id" ? sortedInfo.order : null,
    },
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.length - b.title.length,
      sortOrder: sortedInfo.columnKey === "title" ? sortedInfo.order : null,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      filters: [],
      filteredValue: filteredInfo.author || null,
      onFilter: (value, record) => record.author.includes(value),
      sorter: (a, b) => a.author.length - b.author.length,
      sortOrder: sortedInfo.columnKey === "author" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Nhà xuất bản",
      dataIndex: "publisher",
      key: "publisher",
      filters: [],
      filteredValue: filteredInfo.publisher || null,
      onFilter: (value, record) => record.publisher.includes(value),
      sorter: (a, b) => a.publisher.length - b.publisher.length,
      sortOrder: sortedInfo.columnKey === "publisher" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Thể loại",
      dataIndex: "genre_and_votes",
      key: "genre_and_votes",
      width: "20%",
      filters: [
        {
          text: "Select all",
          value: "all",
        },
        {
          text: "Economics-Finance",
          value: "Economics-Finance",
        },
      ],
      filterMode: "menu",
      filterSearch: true,
      filteredValue: filteredInfo.genre_and_votes || null,
      onFilter: (value, record) =>
        record.genre_and_votes.filter((element) => {
          return element.genre === value;
        }),
      sorter: (a, b) => a.genre_and_votes.length - b.genre_and_votes.length,
      sortOrder:
        sortedInfo.columnKey === "genre_and_votes" ? sortedInfo.order : null,
      ellipsis: true,
      render: (_, record) => {
        const { genre_and_votes } = record;
        const slice = genre_and_votes.slice(0, 2);
        const list = slice.map((e) => e.genre);
        list.push(`+${genre_and_votes.length - 2}`);
        return list.map((e, index) => {
          if (index === 0) {
            return <Tag color="green">{e}</Tag>;
          }
          return <Tag color="volcano">{e}</Tag>;
        });
      },
    },
    {
      title: "Số bình luận",
      dataIndex: "recommended_books",
      key: "recommended_books",
      filters: [
        {
          text: "Chọn tất cả",
          value: "all",
        },
        {
          text: "Dưới 50 bình luận",
          value: "",
        },
        {
          text: "Từ 50 đến 200 bình luận",
          value: "",
        },
        {
          text: "Từ 201 đến 500 bình luận",
          value: "",
        },
        {
          text: "Từ 501 đến 1000 bình luận",
          value: "",
        },
        {
          text: "Trên 1000",
          value: "",
        },
      ],
      filterMode: "menu",
      filterSearch: true,
      filteredValue: filteredInfo.recommended_books || null,
      onFilter: (value, record) => record.recommended_books.includes(value),
      sorter: (a, b) => a.recommended_books.length - b.recommended_books.length,
      sortOrder:
        sortedInfo.columnKey === "recommended_books" ? sortedInfo.order : null,
      ellipsis: true,
      render: (_, record) => {
        const { recommended_books } = record;
        return recommended_books.length;
      },
    },
    {
      title: "Số trang",
      dataIndex: "number_of_pages",
      key: "number_of_pages",
      filters: [],
      filteredValue: filteredInfo.number_of_pages || null,
      onFilter: (value, record) => record.number_of_pages.includes(value),
      sorter: (a, b) => a.number_of_pages.length - b.number_of_pages.length,
      sortOrder:
        sortedInfo.columnKey === "number_of_pages" ? sortedInfo.order : null,
      ellipsis: true,
      render: (_, record) => {
        const { number_of_pages } = record;
        return number_of_pages;
      },
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "year_publish",
      key: "year_publish",
      filters: [],
      sorter: (a, b) =>
        dayjs(new Date(a.year_publish)).valueOf() -
        dayjs(new Date(b.year_publish)).valueOf(),
      sortOrder:
        sortedInfo.columnKey === "year_publish" ? sortedInfo.order : null,
      ellipsis: true,
      return: (_, record) => {
        const { year_publish } = record;
        return dayjs(new Date(year_publish)).format("DD/MM/YYYY");
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      ellipsis: true,
      render: (_, record) => {
        const {
          one_star_ratings,
          two_star_ratings,
          three_star_ratings,
          four_star_ratings,
          five_star_ratings,
          rating_count,
        } = record;
        const rateValue =
          (Number(one_star_ratings) * 1 +
            Number(two_star_ratings) * 2 +
            Number(three_star_ratings) * 3 +
            Number(four_star_ratings) * 4 +
            Number(five_star_ratings) * 5) /
          Number(rating_count);
        return <Rate allowHalf value={Math.round(rateValue)} disabled />;
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => {
        const { id } = record;
        return (
          <div>
            <Button onClick={() => navigate(`/books/${id}`)} type="link">
              <Image src={editImage} width={20} height={20} preview={false} />
            </Button>
            <Button type="link">
              <Image src={deleteImage} width={20} height={20} preview={false} />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Table
      columns={columns}
      dataSource={dataSource?.items || []}
      onChange={handleChange}
      pagination={{
        onChange: (page) => setPage(page),
        total: total,
        current: page,
      }}
    />
  );
};

export default TableComponent;
