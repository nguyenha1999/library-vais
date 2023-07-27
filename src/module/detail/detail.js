import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Upload,
  message,
} from "antd";
import LoadingComponent from "component/loading";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import API from "util/api";
import { QUERY_ITEM_KEY } from "util/const";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const { TextArea } = Input;
const Detail = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();

  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const { data: dataQuery = [], isLoading } = useQuery([QUERY_ITEM_KEY], () => {
    const config = {
      url: `api/books/${id}`,
    };
    return API.request(config);
  });

  const {
    cover_link = "",
    title,
    link,
    author,
    author_link,
    publisher,
    description,
    genre_and_votes,
    recommended_books,
    number_of_pages,
    year_publish,
  } = dataQuery?.record ?? {};

  const optionGenre = useMemo(() => {
    const list = genre_and_votes?.map((e) => {
      return { value: e.genre, label: e.genre };
    });
    return list;
  }, [genre_and_votes]);

  const optionNumberPage = useMemo(() => {
    return [
      {
        label: "Dưới 50 bình luận",
        value: 0,
      },
      {
        label: "Từ 50 đến 200 bình luận",
        value: 1,
      },
      {
        label: "Từ 201 đến 500 bình luận",
        value: 2,
      },
      {
        label: "Từ 501 đến 1000 bình luận",
        value: 3,
      },
      {
        label: "Trên 1000",
        value: 4,
      },
    ];
  }, []);

  const data = useMemo(
    () => [
      {
        title: "Tên sách",
        key: "title",
        value: title,
      },
      {
        title: "Link sách",
        key: "link",
        value: link,
      },
      {
        title: "Tác giả",
        key: "author",
        value: author,
      },
      {
        title: "Link tác giả",
        key: "author_link",
        value: author_link,
      },
      {
        title: "Nhà xuất bản",
        key: "publisher",
        value: publisher,
      },
      {
        title: "Mô tả",
        key: "description",
        value: description,
        type: "textArea",
      },
      {
        title: "Thể loại",
        key: "genre_and_votes",
        value: genre_and_votes?.map((e) => e.genre),
        mode: "multiple",
        type: "select",
        options: optionGenre,
        maxTagCount: 4,
      },
      {
        title: "Bình luận",
        key: "recommended_books",
        value: recommended_books?.length,
      },

      {
        title: "Số trang",
        key: "number_of_pages",
        value: number_of_pages,
        type: "select",
        options: optionNumberPage,
      },
      {
        title: "Năm xuất bản",
        key: "year_publish",
        value: dayjs(new Date(year_publish)),
        type: "date",
      },
    ],
    [
      author,
      author_link,
      description,
      genre_and_votes,
      link,
      number_of_pages,
      optionGenre,
      optionNumberPage,
      publisher,
      recommended_books?.length,
      title,
      year_publish,
    ]
  );

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleChange = (e) => {
    setImageUrl(e?.fileList?.[0]?.originFileObj);
  };

  useEffect(() => {
    if (!isEmpty(dataQuery.record)) {
      data.forEach((e) => {
        form.setFieldsValue({ [e.key]: e.value });
      });
    }
  }, [data, dataQuery, form]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Form
      form={form}
      name="form-edit"
      layout="inline"
      labelCol={{
        span: 2,
      }}
    >
      <div
        style={{
          flexDirection: "column",
          flex: 1,
          display: "flex",
          padding: 24,
        }}
      >
        <p style={{ fontSize: 24, fontWeight: 600, margin: "12px 0 0 0" }}>
          Chỉnh sửa sách
        </p>
        <Divider />
        <Form.Item
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            accept="image/*"
            maxCount={1}
          >
            {imageUrl ? (
              <img
                src={URL.createObjectURL(imageUrl)}
                alt="avatar"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                }}
              />
            ) : !isEmpty(cover_link) ? (
              <img
                src={cover_link}
                alt="avatar"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                }}
              />
            ) : null}
          </Upload>
        </Form.Item>

        {data.map((item) => {
          const { title, type, key, rules, options, mode, maxTagCount } = item;
          return (
            <Fragment>
              <Divider />
              <Form.Item name={key} rules={rules} label={title}>
                {type === "textArea" ? (
                  <TextArea name={key} />
                ) : type === "select" ? (
                  <Select
                    name={key}
                    options={options}
                    mode={mode}
                    maxTagCount={maxTagCount}
                  />
                ) : type === "date" ? (
                  <DatePicker name={key} format="DD/MM/YYYY" />
                ) : (
                  <Input name={key} />
                )}
              </Form.Item>
            </Fragment>
          );
        })}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 36,
          }}
        >
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default Detail;
