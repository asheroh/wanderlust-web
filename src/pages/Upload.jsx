import { useContext, useEffect, useState } from "react";
import Header from "../components/Fragments/Header";
import Nav from "../components/Fragments/Nav";
import { Body, GridWrapper } from "../components/Home/HomeStyle";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import ResNav from "../components/Fragments/ResNav";
import {
  AdInput,
  AdInputSection,
  AdUploadButton,
  AdUploadGridBox,
  AdUploadSection,
  CheckBoxInput,
  ContentBox,
  FullIcon,
  InfoInputSection,
  InfoTagBox,
  InfoTitleBox,
  LinkBox,
  NormalSpan,
  RemoveButton,
  Shadow,
  SmallImage,
  SmallTitle,
  SpanTitle,
  TagCheckSection,
  TagItemBox,
  TagScrollBox,
  TagTitle,
  TagWrapper,
  ThumbnailImage,
  TimeBox,
  TimeInput,
  TitleInput,
  TitleLeftBox,
  TitleThumbnailWrapper,
  TitleWrapper,
  VideoThumbnailSection,
  VideoThumbnailUploadButton,
  VideoThumbnailUploadInput,
  VideoUploadSection,
} from "../components/Home/UploadStyle";
import Plus from "../assets/images/plus.svg";
import Minus from "../assets/images/minus.svg";
import PlusButton from "../assets/images/plus-button.svg";
import axios from "axios";
import UploadComponent from "../components/Fragments/UploadComponent";

// Upload EC2
// 13.125.69.94:8021
// Content-Slave
// 13.125.69.94:8011

const Upload = () => {
  // Constant----------------------------------------------------
  const navigate = useNavigate();
  const { userId } = useParams();

  // State-------------------------------------------------------
  const { setPage } = useContext(GlobalContext);
  const [step, setStep] = useState({
    first: true,
    second: false,
  });

  //
  const [videoTitle, setVideoTitle] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [tagIdList, setTagIdList] = useState([]);
  const [regionTag, setRegionTag] = useState([]);
  const [themeTag, setThemeTag] = useState([]);
  const [adList, setAdList] = useState([{ adUrl: "", adContent: "", startTime: "", endTime: "" }]);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("00:00:00");

  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    setStartTime(timeValue);
  };

  const handleVideoTitle = (e) => setVideoTitle(e.target.value);
  const handleThumbnailFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setThumbnailFile(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  // Function----------------------------------------------------
  const fetchData = async () => {
    const regionData = await axios.get(`http://13.125.69.94:8021/upload-service/tags/region`);
    const themeData = await axios.get(`http://13.125.69.94:8021/upload-service/tags/theme`);
    setRegionTag(regionData.data.payload.tags);
    setThemeTag(themeData.data.payload.tags);
  };

  const handleSubmit = async (e) => {
    const requestData = {
      thumbnail: null,
      requestUpload: {
        videoName: "",
        tagIdList: [],
        adList: [{ adUrl: "", adContent: "", startTime: "", endTime: "" }],
      },
    };
    try {
      await axios
        .post(`http://13.125.69.94:8021/upload-service/videos/${userId}/{videoId}`, requestData)
        .then((res) => {
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
  };

  // ComponentDidMount-------------------------------------------
  useEffect(() => {
    setPage(1);
    fetchData();
  }, []);

  return (
    <GridWrapper>
      <Header />
      <Nav />
      <Body>
        <ResNav userId={userId} />
        <VideoUploadSection>
          {/* 영상 업로드 컴포넌트 조각 */}
          <UploadComponent userId={userId} step={step} setStep={setStep} />
          <br />
          {/* 영상 정보 등록 컴포넌트 조각 */}
          <InfoInputSection>
            {/* {!step.second && <Shadow>STEP 2</Shadow>} */}
            <InfoTitleBox>
              <TitleWrapper>
                <SmallTitle>제목</SmallTitle>
                <TitleInput
                  type="text"
                  placeholder="제목을 입력해주세요."
                  onChange={handleVideoTitle}
                />
              </TitleWrapper>
              <TitleThumbnailWrapper>
                <SmallTitle>썸네일</SmallTitle>
                <VideoThumbnailSection>
                  <VideoThumbnailUploadInput
                    type="file"
                    accept="image/*"
                    id="thumbnail-input"
                    onChange={handleThumbnailFile}
                  />
                  <VideoThumbnailUploadButton
                    htmlFor="thumbnail-input"
                    thumbnailfile={thumbnailFile}
                  >
                    <FullIcon src={Plus} alt="plus-icon" loading="lazy" />
                  </VideoThumbnailUploadButton>
                  {thumbnailPreview && (
                    <ThumbnailImage src={thumbnailPreview} alt="thumbnail-image" loading="lazy" />
                  )}
                </VideoThumbnailSection>
              </TitleThumbnailWrapper>
            </InfoTitleBox>
            <InfoTagBox>
              <SmallTitle>태그</SmallTitle>
              <TagWrapper>
                <TagCheckSection>
                  <TagTitle>지역 태그</TagTitle>
                  <TagScrollBox>
                    {regionTag.map((region) => (
                      <TagItemBox key={region.tagId}>
                        <NormalSpan>{region.content}</NormalSpan>
                        <CheckBoxInput
                          type="checkbox"
                          id="checkbox"
                          onChange={() => {
                            setTagIdList([...tagIdList, region.tagId]);
                          }}
                        />
                      </TagItemBox>
                    ))}
                  </TagScrollBox>
                </TagCheckSection>
                <TagCheckSection>
                  <TagTitle>테마 태그</TagTitle>
                  <TagScrollBox>
                    {themeTag.map((theme) => (
                      <TagItemBox key={theme.tagId}>
                        <NormalSpan>{theme.content}</NormalSpan>
                        <CheckBoxInput
                          type="checkbox"
                          id="checkbox"
                          onChange={() => {
                            setTagIdList([...tagIdList, theme.tagId]);
                          }}
                        />
                      </TagItemBox>
                    ))}
                  </TagScrollBox>
                </TagCheckSection>
              </TagWrapper>
            </InfoTagBox>
          </InfoInputSection>
        </VideoUploadSection>
        <AdUploadSection>
          {/* {!step.second && <Shadow>STEP 2</Shadow>} */}
          <TitleLeftBox>
            <SpanTitle>광고등록</SpanTitle>
            <AdUploadButton>
              <FullIcon src={PlusButton} alt="plus-button" loading="lazy" />
            </AdUploadButton>
          </TitleLeftBox>
          <AdUploadGridBox>
            <AdInputSection>
              <TimeBox>
                <NormalSpan>시작</NormalSpan>
                <TimeInput type="time" value={startTime} onChange={handleTimeChange} />
                <NormalSpan>종료</NormalSpan>
                <TimeInput type="time" defaultValue="00:00:00" />
              </TimeBox>
              <ContentBox>
                <NormalSpan>내용</NormalSpan>
                <AdInput
                  type="text"
                  placeholder="광고로 등록할 내용을 입력해주세요."
                  width="250px"
                  height="100px"
                />
              </ContentBox>
              <LinkBox>
                <NormalSpan>링크</NormalSpan>
                <AdInput
                  type="text"
                  placeholder="광고 링크를 첨부해주세요."
                  width="250px"
                  height="35px"
                />
              </LinkBox>
              <RemoveButton>
                <SmallImage src={Minus} alt="minus" />
              </RemoveButton>
              <br />
            </AdInputSection>
          </AdUploadGridBox>
        </AdUploadSection>
      </Body>
    </GridWrapper>
  );
};

export default Upload;
