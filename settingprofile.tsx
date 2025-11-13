import React from 'react';
import './settingprofile.scss';
import { FaUser, FaTrophy, FaEnvelope, FaUserCog, FaChartBar, FaBuilding, FaTwitter, FaGlobe, FaMapMarkerAlt, FaPen } from 'react-icons/fa';

const SettingProfile = () => {
  return (
    <div className="spgRoot">
      {/* Sidebar */}
      <aside className="spgSidebar">
        <div className="spgSettingsTitle">Settings</div>
        <nav className="spgMenu">
          <div className="spgMenuItem" tabIndex={0}><FaUser className="spgMenuIcon"/>Hồ sơ</div>
          <div className="spgMenuItem" tabIndex={0}><FaTrophy className="spgMenuIcon"/>Thành tích</div>
          <div className="spgMenuItem" tabIndex={0}><FaEnvelope className="spgMenuIcon"/>Email</div>
          <div className="spgMenuItem" tabIndex={0}><FaUserCog className="spgMenuIcon"/>Tài khoản</div>
          <div className="spgMenuItem" tabIndex={0}><FaChartBar className="spgMenuIcon"/>Số liệu thống kê</div>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="spgMain">
        <div className="spgHeader">Personal Information</div>
        <div className="spgHint">Thông tin này sẽ được hiển thị công khai trên hồ sơ của bạn.</div>
        <form className="spgForm">
          <div className="spgRow">
            <div className="spgField">
              <label><FaUser className="spgFieldIcon"/> Tên</label>
              <input type="text" placeholder="User" />
            </div>
            <div className="spgField">
              <label><FaMapMarkerAlt className="spgFieldIcon"/> Địa chỉ</label>
              <input type="text" placeholder="Địa chỉ của bạn" />
            </div>
          </div>
          <div className="spgRow">
            <div className="spgField">
              <label><FaBuilding className="spgFieldIcon"/> Công ty</label>
              <input type="text" placeholder="Công ty của bạn" />
            </div>
            <div className="spgField">
              <label><FaTwitter className="spgFieldIcon"/> Twitter</label>
              <input type="text" placeholder="Twitter của bạn" />
            </div>
          </div>
          <div className="spgRow">
            <div className="spgFieldFull">
              <label><FaGlobe className="spgFieldIcon"/> Websites</label>
              <input type="text" placeholder="Địa chỉ trang web của bạn" />
            </div>
          </div>
          <div className="spgRow">
            <div className="spgFieldFull">
              <label><FaPen className="spgFieldIcon"/> Ghi chú</label>
              <textarea placeholder="Thêm ghi chú ......" rows={4}></textarea>
            </div>
          </div>
        </form>
      </main>
      {/* Footer 
      <footer className="spgFooter">
        <div className="spgFooterWrap">
          <div className="spgFooterCol">
            <div className="spgUiverse"><span className="spgBrandBlue">UI</span>VERSE</div>
            <div className="spgUiverseSub">Uiverse | Vũ trụ của UI</div>
            <div><span aria-label="justice" role="img">⚖️</span> Giấy phép MIT</div>
            <div>Mọi nội dung (thành phần UI) trên trang web này đều được xuất bản theo <a href="#">Giấy phép MIT</a>.</div>
          </div>
          <div className="spgFooterCol">
            <b>Thông tin</b>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Hướng dẫn đăng bài</a></li>
              <li><a href="#">Đưa ra phản hồi</a></li>
              <li><a href="#">Báo cáo lỗi</a></li>
            </ul>
          </div>
          <div className="spgFooterCol">
            <b>Hợp pháp</b>
            <ul>
              <li><a href="#">Điều khoản và Điều kiện</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Chính sách cookie</a></li>
              <li><a href="#">Tuyên bố miễn trừ trách nhiệm</a></li>
            </ul>
          </div>
        </div>
      </footer>*/}
    </div>
  );
};

export default SettingProfile;
