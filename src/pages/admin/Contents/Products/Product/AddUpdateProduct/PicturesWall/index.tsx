import { message, Modal, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useCallback, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../../../../../config/config";
import { reqDeleteImage } from "../../../../../../../api/requests";
import { Response, RESPONSE_STATUS } from "../../../../../../../api/types";
import { Image } from "../../../../../../../model/image";

function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function PicturesWall({
  fileList,
  setFileList,
}: {
  fileList: UploadFile<Response<Image>>[];
  setFileList: React.Dispatch<
    React.SetStateAction<UploadFile<Response<Image>>[]>
  >;
}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = useCallback(() => setPreviewVisible(false), [
    setPreviewVisible,
  ]);

  const handlePreview = async (
    file: UploadFile<UploadFile<Response<Image>>[]>
  ) => {
    if (!file.url && !file.preview) {
      try {
        file.preview = (await getBase64(file.originFileObj as Blob)) as string;
      } catch (err) {
        message.warning("Base64编码图片出错");
      }
    }

    setPreviewImage(file.url || file.preview!);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url?.substring(file.url.lastIndexOf("/") + 1) || ""
    );
  };

  const handleChange = useCallback(
    ({ file, fileList }: UploadChangeParam<UploadFile<Response<Image>>>) => {
      //当完成上传图片时，将response中的url注入fileList中
      if (
        file.status === "done" &&
        file.response?.status === RESPONSE_STATUS.SUCCESS
      ) {
        const f = fileList.find((item) => item.uid === file.uid)!;
        f.url = file.response!.data!.url;
        f.name = file.response!.data!.name;
      } else if (file.status === "error") {
        message.warning("图片上传失败");
      } else if (file.status === "removed") {
        reqDeleteImage(file.name).then((res) => {
          if (res.status !== 0) {
            message.warning("删除已上传图片失败");
          }
        });
      }
      console.log(fileList);
      setFileList([...fileList]);
    },
    [setFileList]
  );

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Upload
        action={`${BASE_URL}/manage/img/upload`}
        name="image"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
}
