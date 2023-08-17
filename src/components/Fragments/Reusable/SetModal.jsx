import Modal from "react-modal";
import * as H from "../../Home/HomeStyle";
import * as S from "../../Sign/SignStyle";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { BASE_URL, Instance } from "../../../api/axios";
import { useParams } from "react-router-dom";

const customStyles = {
  content: {
    backgroundColor: "white",
    border: "2px solid #1DAE86",
    borderRadius: "4px",
    outline: "none",
    padding: "20px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    minWidth: "350px",
  },
};

Modal.setAppElement("#root");

const SetModal = ({ modal, setModal }) => {
  // Constant----------------------------------------------
  const { userId } = useParams();
  // State-------------------------------------------------
  const [sellerName, setSellerName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sellerLogo, setSellerLogo] = useState(null);

  // function----------------------------------------------

  // ComponentDidMount-------------------------------------
  const fetchData = async () => {
    try {
      await Instance.get(`${BASE_URL}user-service/sellers/${userId}`).then(
        (res) => {
          setSellerName(res.data.payload.sellerName);
          setSellerLogo(res.data.payload.sellerLogo);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Modal
      isOpen={modal}
      onRequestClose={() => setModal(false)}
      style={customStyles}
    >
      <H.ModalSection>
        <H.ModalTitle>회원 이름 수정</H.ModalTitle>
        <H.ModalInputSection>
          <H.ModalInput
            type="text"
            placeholder="변경할 유저 이름을 작성하세요"
            defaultValue={sellerName && sellerName}
          />
          <S.ColorButton width="30%">수정</S.ColorButton>
        </H.ModalInputSection>
        <H.ModalTitle>회원 비밀번호 수정</H.ModalTitle>
        <H.ModalInputSection>
          <H.ModalBetweenBox width="70%">
            <H.ModalInput
              type="password"
              placeholder="기존 비밀번호를 작성하세요"
            />
            <H.ModalInput
              type="password"
              placeholder="변경할 비밀번호를 작성하세요"
            />
          </H.ModalBetweenBox>
          <S.ColorButton width="30%">수정</S.ColorButton>
        </H.ModalInputSection>
        <H.ModalTitle>회원 로고 수정</H.ModalTitle>
        <H.ModalInputSection>
          <H.ModalInput
            type="text"
            placeholder="로고 이미지"
            defaultValue={sellerLogo && sellerLogo}
          />
          <H.ModalBetweenBox width="30%">
            <H.ModalFileInput
              id="file-input"
              type="file"
              accept="image/"
              placeholder="로고 이미지"
            />
            <H.ModalFileInputLabel htmlFor="file-input">
              로고 업로드
            </H.ModalFileInputLabel>
            <S.ColorButton width="80px">수정</S.ColorButton>
          </H.ModalBetweenBox>
        </H.ModalInputSection>
      </H.ModalSection>
    </Modal>
  );
};

export default SetModal;

SetModal.propTypes = {
  modal: PropTypes.bool,
  setModal: PropTypes.func,
};
